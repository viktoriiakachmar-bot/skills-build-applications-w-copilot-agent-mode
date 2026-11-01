import { isValidObjectId } from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

export async function listActivities() {
  return Activity.find().lean();
}

function badRequest(message: string, status = 400) {
  return Object.assign(new Error(message), { status });
}

export async function createActivity(input: unknown) {
  const body = (input ?? {}) as Record<string, unknown>;
  const { userId, teamId, type, minutes } = body;
  if (typeof userId !== 'string' || !isValidObjectId(userId)) throw badRequest('userId must be a valid id');
  if (typeof teamId !== 'string' || !isValidObjectId(teamId)) throw badRequest('teamId must be a valid id');
  if (typeof type !== 'string' || !type.trim()) throw badRequest('type is required');
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes <= 0) throw badRequest('minutes must be a positive number');
  const occurredAt = body.occurredAt === undefined ? new Date() : new Date(String(body.occurredAt));
  if (Number.isNaN(occurredAt.getTime())) throw badRequest('occurredAt must be a valid date');
  const [user, team] = await Promise.all([User.exists({ _id: userId }), Team.exists({ _id: teamId })]);
  if (!user) throw badRequest('user not found', 404);
  if (!team) throw badRequest('team not found', 404);
  const activity = await Activity.create({ user: userId, team: teamId, type: type.trim(), minutes, points: Math.round(minutes), occurredAt });
  return activity.toObject();
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  const body = (input ?? {}) as Record<string, unknown>;
  const { name, mascot } = body;
  if (typeof name !== 'string' || !name.trim()) throw badRequest('name is required');
  if (typeof mascot !== 'string' || !mascot.trim()) throw badRequest('mascot is required');
  const members = body.members ?? [];
  if (!Array.isArray(members) || !members.every((id) => typeof id === 'string' && isValidObjectId(id))) {
    throw badRequest('members must be an array of valid ids');
  }
  if (members.length && (await User.countDocuments({ _id: { $in: members } })) !== new Set(members).size) {
    throw badRequest('member not found', 404);
  }
  const team = await Team.create({ name: name.trim(), mascot: mascot.trim(), members });
  return team.toObject();
}

export async function getLeaderboard() {
  const totals = await Activity.aggregate<{ _id: unknown; totalPoints: number }>([
    { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    { $sort: { totalPoints: -1, _id: 1 } },
  ]);
  const teams = await Team.find({ _id: { $in: totals.map((total) => total._id) } }).lean();
  const names = new Map(teams.map((team) => [String(team._id), team.name]));
  return totals.map((total, index) => ({
    teamId: String(total._id),
    teamName: names.get(String(total._id)) ?? 'Unknown team',
    totalPoints: total.totalPoints,
    rank: index + 1,
  }));
}

const strengthTypes = new Set(['strength', 'weights', 'lift']);

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail.trim().toLowerCase() }).lean();
  if (!user) throw badRequest('user not found', 404);
  const activities = await Activity.find({ user: user._id }).lean();
  const minutesByFocus = new Map<string, number>();
  for (const activity of activities) {
    const focus = strengthTypes.has(activity.type) ? 'strength' : 'endurance';
    minutesByFocus.set(focus, (minutesByFocus.get(focus) ?? 0) + activity.minutes);
  }
  const [topFocus] = [...minutesByFocus.entries()].sort((left, right) => right[1] - left[1])[0] ?? [];
  const focus = topFocus ?? user.fitnessGoal;
  const reason = topFocus ? `Matches your recent ${topFocus} activity` : `Matches your ${focus} goal`;
  const workouts = await Workout.find().sort({ title: 1 }).lean();
  return workouts
    .filter((workout) => workout.focus === focus)
    .map((workout) => ({ ...workout, reason }));
}

export { User };
