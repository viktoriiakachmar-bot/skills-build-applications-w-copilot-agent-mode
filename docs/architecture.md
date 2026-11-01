# Architecture Summary & Test Plan

## Tier Boundaries
- Presentation tier decision: React UI application in `octofit-tracker/frontend` running on port 5173
- Logic tier decision: Express API service in `octofit-tracker/backend` running on port 8000
- Data tier decision: Database and seed integration running on port 27017

## Feature Approaches
- Activity tracking approach: Implement REST API endpoints for user Activity tracking.
- Team management approach: Create backend routes and database schemas for Teams management.
- Workout suggestions approach: Add logic to generate personalized Workout suggestions.
- Leaderboard approach: Implement logic to calculate and display the Leaderboard.

## Current Failing Tests
- Baseline test failure in Activity tracking endpoint.
- Database seed integration test failure.

## Smallest Safe Implementation Order
1. Update the activity data model and seed script; validate the seed integration test.
2. Implement Activity tracking, Teams, Leaderboard, and Workout suggestions routes; validate the endpoint tests.
3. Connect frontend components to the shared API client with error handling.