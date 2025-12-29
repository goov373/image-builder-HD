# Deployment Guide

This guide walks you through deploying the HTML Content Builder with authentication and cloud storage.

## Prerequisites

- A GitHub account
- 30-60 minutes

---

## Step 1: Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**
3. Fill in:
   - **Name**: `content-builder` (or whatever you prefer)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose one close to your team
4. Click **Create new project** and wait ~2 minutes

### Get Your API Keys

1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIs...`

### Create the Database Table

1. Go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this SQL and click **Run**:

```sql
-- Create projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text default 'carousel',
  data jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (users can only see their own projects)
alter table projects enable row level security;

-- Policy: Users can see their own projects
create policy "Users can view own projects" on projects
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own projects  
create policy "Users can insert own projects" on projects
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own projects
create policy "Users can update own projects" on projects
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own projects
create policy "Users can delete own projects" on projects
  for delete using (auth.uid() = user_id);
```

### Add Team Members

1. Go to **Authentication** → **Users** in the left sidebar
2. Click **Add User** → **Create new user**
3. Enter their email and set a password
4. Share the login credentials with them

---

## Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 1.

---

## Step 3: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with auth"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. In the **Environment Variables** section, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

Your app will be live at: `https://your-project-name.vercel.app`

---

## Step 5: (Optional) Add Custom Domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Add your custom domain (e.g., `tools.yourcompany.com`)
3. Follow the DNS instructions to point your domain to Vercel

---

## Managing Users

To add a new team member:
1. Go to your Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter their email and set a password
4. Share the credentials with them

To remove a user:
1. Go to **Authentication** → **Users**
2. Click on the user
3. Click **Delete user**

---

## Troubleshooting

### "Supabase credentials not found" warning
- Make sure your `.env` file exists and has the correct values
- For Vercel, make sure environment variables are set in project settings

### Login not working
- Check that you've created users in Supabase Authentication
- Make sure the email and password are correct
- Check the browser console for error messages

### Projects not saving
- Verify the `projects` table exists in Supabase
- Check that Row Level Security policies are in place
- Look at the browser console for error messages

---

## Local Development

The app works in "local mode" without Supabase configured:
- No login required
- Projects saved to browser localStorage
- Perfect for development and testing

To enable cloud features locally, add the `.env` file with your Supabase credentials.

