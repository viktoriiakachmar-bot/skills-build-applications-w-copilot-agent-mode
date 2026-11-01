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

export async function createTeam(_input: unknown) {
  throw Object.assign(new Error('Team validation is not implemented yet'), { status: 501 });
}

export async function getLeaderboard() {
  return [];
}

export async function suggestWorkouts(_userEmail: string) {
  return Workout.find().limit(1).lean();
}

export { User };
