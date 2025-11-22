# Git Workflow Guide for EMS Project

## Branch Structure

```
master (main)           → Production (Auto-deploys to Vercel production)
  └─ development        → Staging (Auto-deploys to Vercel preview)
       └─ feature/*     → Feature branches
       └─ bugfix/*      → Bug fix branches
       └─ hotfix/*      → Urgent production fixes
```

## Daily Workflow

### 1. Start Working on a New Feature

```bash
# Switch to development and get latest code
git checkout development
git pull origin development

# Create a new feature branch
git checkout -b feature/your-feature-name
# Examples:
# git checkout -b feature/exam-analytics
# git checkout -b feature/student-reports
```

### 2. Work on Your Code

```bash
# Make changes, then stage them
git add .

# Commit with descriptive message
git commit -m "feat: add student analytics dashboard"
# or
git commit -m "fix: resolve login authentication issue"
git commit -m "docs: update README with deployment steps"
```

### 3. Push Your Feature Branch

```bash
# First time pushing this branch
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

### 4. Create Pull Request on GitHub

1. Go to: https://github.com/kennywonda/EMS
2. Click "Pull Requests" → "New Pull Request"
3. Select: `feature/your-feature-name` → `development`
4. Add description and create PR
5. Wait for Vercel preview deployment
6. Test the preview URL
7. Merge when ready

### 5. Deploy to Production

```bash
# After testing on development, merge to master
# Create PR: development → master on GitHub
# Vercel will auto-deploy to production
```

## Common Commands

### Update Your Branch with Latest Development

```bash
git checkout development
git pull origin development
git checkout feature/your-feature-name
git merge development
# Resolve conflicts if any
git push
```

### Delete Branch After Merge

```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch
git push origin --delete feature/your-feature-name
```

### Quick Status Check

```bash
git status                    # See current changes
git branch                    # See all local branches
git branch -r                 # See all remote branches
git log --oneline -5          # See last 5 commits
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- filename.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Commit Message Convention

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Examples:**
```bash
git commit -m "feat: add teacher grading interface"
git commit -m "fix: resolve student login authentication error"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize exam submission logic"
```

## Vercel Integration

### Auto-Deployment Rules:

1. **Push to `master`** → Deploys to **Production**
   - URL: `https://your-app.vercel.app`

2. **Push to `development`** → Deploys to **Preview** (staging)
   - URL: `https://your-app-git-development-username.vercel.app`

3. **Push to `feature/*`** → Creates **Preview Deployment**
   - URL: `https://your-app-git-feature-name-username.vercel.app`

### Environment Variables:

Make sure to set these in Vercel dashboard:
- `MONGODB_URI` - Your MongoDB connection string
- `NEXTAUTH_SECRET` - Your auth secret
- Any other `.env` variables

## Quick Reference

### Starting a New Day:

```bash
git checkout development
git pull origin development
git checkout -b feature/new-feature
# Start coding...
```

### Ending Your Work:

```bash
git add .
git commit -m "feat: describe what you did"
git push origin feature/new-feature
# Create PR on GitHub
```

### Emergency Hotfix:

```bash
# For urgent production fixes
git checkout master
git pull origin master
git checkout -b hotfix/critical-bug
# Fix the bug
git add .
git commit -m "hotfix: fix critical production bug"
git push origin hotfix/critical-bug
# Create PR: hotfix/critical-bug → master
```

## Current Setup

You are currently on: **development** branch
- ✅ `master` branch exists (production)
- ✅ `development` branch exists (staging)
- ✅ Ready to create feature branches

## Next Steps

1. Keep `master` as your production branch (protected)
2. Do all development work on `development` branch
3. Create feature branches for new features
4. Use Pull Requests for code review
5. Connect to Vercel for auto-deployments

## Protecting Branches (Recommended on GitHub)

1. Go to: Settings → Branches → Add rule
2. Branch name pattern: `master`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Include administrators
4. Save changes
5. Repeat for `development` branch
