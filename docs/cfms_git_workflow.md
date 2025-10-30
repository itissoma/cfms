# CFMS PROJECT - GIT WORKFLOW STRATEGY

**Date:** 2025-10-30  
**Status:** CORRECTED - Proper Branching Model

---

## 🌳 BRANCH STRUCTURE

```
feature/[feature-name]  → Local development, frequent commits
         ↓
       dev              → Development/staging, testing
         ↓
       main             → Production-ready releases only
```

---

## 📋 BRANCHING RULES

### feature/* branches:
- **Purpose:** Active development work
- **Naming:** `feature/v0.84-ui-enhancement`, `feature/v0.85-navigation-fixes`
- **Commits:** As many as needed (frequent, incremental)
- **Push:** To origin when you want backup or collaboration
- **Merge:** Into `dev` when feature is complete and tested locally

### dev branch:
- **Purpose:** Integration and testing environment
- **Deploy to:** chs-stg.cfms.hub.etadvisory.com (staging server)
- **Commits:** Only merged features from feature branches
- **Tags:** Can tag here for testing milestones (v0.84-rc1, v0.84-rc2)
- **Merge:** Into `main` after thorough testing

### main branch:
- **Purpose:** Production-ready code only
- **Deploy to:** Production server (when ready)
- **Commits:** Only merged from `dev` after successful testing
- **Tags:** Official releases only (v0.84, v0.85, v1.0)
- **Protection:** Should be protected (no direct pushes)

---

## 🚀 WORKFLOW FOR v0.84

### Current Situation:
You've committed v0.84 to... which branch? Let's check:

```bash
cd /home/frappe/frappe-bench/apps/cfms
git branch
git status
```

---

## 📝 CORRECT WORKFLOW (What Should Have Happened)

### Step 1: Create Feature Branch
```bash
# Should have started here:
git checkout -b feature/v0.84-ui-enhancement

# Do all the work (kiosk mode, forms, sidebar)
# Multiple commits as you go

git add cfms/public/js/
git commit -m "Add kiosk mode JavaScript"

git add cfms/cfms/doctype/cfms_expense/
git commit -m "Compress expense form with collapsible sections"

# ... more incremental commits ...

# Final commit
git add docs/
git commit -m "Update documentation for v0.84"
```

### Step 2: Merge to Dev
```bash
# Switch to dev
git checkout dev

# Merge feature branch
git merge feature/v0.84-ui-enhancement

# Tag for testing
git tag -a v0.84-dev -m "v0.84 ready for staging testing"

# Push to remote dev
git push origin dev
git push origin v0.84-dev

# Deploy to staging server
cd /home/frappe/frappe-bench
bench --site chs-stg.cfms.hub.etadvisory.com migrate
bench clear-cache
bench build --app cfms --force
bench restart
```

### Step 3: Test in Staging
- Test all features on chs-stg.cfms.hub.etadvisory.com
- Get user feedback
- Fix bugs if needed (new commits to feature branch, then re-merge to dev)

### Step 4: Merge to Main (After Testing)
```bash
# Only after thorough testing in dev
git checkout main

# Merge from dev (not feature branch!)
git merge dev

# Tag official release
git tag -a v0.84 -m "v0.84: UI Enhancement Complete

Major Features:
- Kiosk mode
- Compressed forms  
- Sidebar cleanup

Status: Production-ready"

# Push to remote
git push origin main
git push origin v0.84
```

---

## 🔧 FIXING CURRENT SITUATION

### If You Committed Directly to main:

**Option A: Keep it (if main is already ahead)**
```bash
# Check where you are
git branch
git log -1

# If you're on main and already committed:
# Create dev from current main
git checkout -b dev
git push origin dev

# Tag on dev first
git tag -a v0.84-dev -m "v0.84 staging"
git push origin v0.84-dev

# Then tag on main
git checkout main
git tag -a v0.84 -m "v0.84 production"
git push origin main v0.84
```

**Option B: Reset and Do It Right**
```bash
# If you want proper history:
git branch feature/v0.84-ui-enhancement  # Save your work
git reset --hard HEAD~1  # Undo commit on main

# Create dev if doesn't exist
git checkout -b dev

# Merge feature
git merge feature/v0.84-ui-enhancement

# Tag and push
git tag -a v0.84-dev -m "v0.84 staging"
git push origin dev v0.84-dev

# Then to main after testing
git checkout main
git merge dev
git tag -a v0.84 -m "v0.84 production"
git push origin main v0.84
```

---

## 📊 TAG STRATEGY

### Development Tags (on dev branch):
- `v0.84-dev` or `v0.84-rc1` - Development/staging versions
- `v0.85-dev` - Next version in staging
- Purpose: Track staging deployments

### Release Tags (on main branch):
- `v0.84` - Official production release
- `v0.85` - Next production release
- Purpose: Mark production-ready code

### Feature Tags (optional, on feature branches):
- `v0.84-wip-2025-10-30` - Work in progress snapshots
- Purpose: Bookmarks during development

---

## 🎯 FUTURE WORKFLOW (v0.85 and Beyond)

### Starting v0.85 (Phase 1 Navigation Fixes):

```bash
# Always start from dev
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feature/v0.85-phase1-navigation

# Do the work (multiple commits)
git add [files]
git commit -m "Fix landing page redirect (TODO-001)"

git add [files]
git commit -m "Clean up user dropdown (TODO-004)"

# ... more commits ...

# When complete, merge to dev
git checkout dev
git merge feature/v0.85-phase1-navigation

# Tag for staging
git tag -a v0.85-dev -m "v0.85 Phase 1 staging"

# Push to dev
git push origin dev v0.85-dev

# Deploy to staging and test
# ... testing phase ...

# After successful testing, merge to main
git checkout main
git merge dev
git tag -a v0.85 -m "v0.85: Phase 1 Navigation Fixes Complete"
git push origin main v0.85
```

---

## 📋 QUICK REFERENCE

### Daily Development:
```bash
# Working on feature
git checkout feature/[name]
git add .
git commit -m "Incremental change"
git push origin feature/[name]  # Backup
```

### Ready for Testing:
```bash
git checkout dev
git merge feature/[name]
git tag -a v[X.XX]-dev -m "Description"
git push origin dev v[X.XX]-dev
# Deploy to staging
```

### Ready for Production:
```bash
git checkout main
git merge dev  # Only after testing!
git tag -a v[X.XX] -m "Production release"
git push origin main v[X.XX]
# Deploy to production
```

---

## 🚫 NEVER DO THIS

- ❌ Commit directly to main (except hotfixes)
- ❌ Push untested code to main
- ❌ Merge feature branches directly to main (skip dev)
- ❌ Tag on main before testing in dev
- ❌ Delete feature branches before merged to dev

---

## ✅ ALWAYS DO THIS

- ✅ Create feature branch for each version/feature
- ✅ Commit frequently to feature branch
- ✅ Merge to dev first, test thoroughly
- ✅ Tag on dev for staging deployments
- ✅ Only merge to main after successful dev testing
- ✅ Keep feature branches until merged to main

---

## 🎓 SUMMARY

**The Flow:**
```
1. feature/v0.XX → Work here (many commits)
2. dev → Merge here, tag v0.XX-dev, test on staging
3. main → Merge here after testing, tag v0.XX, deploy to prod
```

**Tags:**
- Dev: `v0.XX-dev` or `v0.XX-rc1` (release candidates)
- Main: `v0.XX` (official releases)

**Protection:**
- main = production (stable, tested)
- dev = staging (integration, testing)
- feature/* = work in progress

---

**This is the professional workflow!** ✅

**Document Version:** 1.0  
**Created:** 2025-10-30  
**Status:** OFFICIAL CFMS GIT WORKFLOW
