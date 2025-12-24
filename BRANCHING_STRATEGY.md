# Branching Strategy

This project uses a two-branch workflow for managing development and production deployments.

## Branches

### `master` (Production)
- **Purpose**: Production-ready code
- **Deployment**: Deploys to production environment
- **Protection**: Should only receive code via merges from `develop`
- **Status**: Stable, tested, and ready for production use

### `develop` (Development)
- **Purpose**: Active development branch
- **Deployment**: Can be deployed to a separate development/staging environment
- **Status**: Contains latest features and changes being tested

## Workflow

### Daily Development
1. **Work on `develop` branch**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Push to develop**:
   ```bash
   git push origin develop
   ```

### Deploying Development Branch
The `develop` branch can be deployed separately to a development/staging environment:
```bash
git checkout develop
git pull origin develop
npm run build:dev  # Uses development mode build
```

### Merging to Production
When `develop` is stable and ready for production:

1. **Switch to master**:
   ```bash
   git checkout master
   git pull origin master
   ```

2. **Merge develop into master**:
   ```bash
   git merge develop
   ```

3. **Push to production**:
   ```bash
   git push origin master
   ```

4. **Deploy production**:
   ```bash
   npm run build  # Production build
   ```

## Best Practices

1. **Always pull before starting work**:
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Keep commits focused**: Make small, logical commits with clear messages

3. **Test before merging**: Ensure `develop` is stable before merging to `master`

4. **Use feature branches** (optional): For larger features, create feature branches from `develop`:
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   # ... make changes ...
   git push origin feature/your-feature-name
   # Create PR to merge into develop
   ```

5. **Regular merges**: Merge `develop` into `master` regularly to keep production up to date

## Deployment Configuration

### Development Deployment
- Branch: `develop`
- Build command: `npm run build:dev`
- Environment: Development/Staging

### Production Deployment
- Branch: `master`
- Build command: `npm run build`
- Environment: Production

## Quick Reference

```bash
# Switch to develop branch
git checkout develop

# Switch to master branch
git checkout master

# Create new feature branch from develop
git checkout develop
git checkout -b feature/new-feature

# Merge develop into master (when ready for production)
git checkout master
git merge develop
git push origin master

# Update develop with latest from master (if needed)
git checkout develop
git merge master
```

