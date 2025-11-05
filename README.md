## Dockerized Development Environment

- Install Docker Desktop (or Docker Engine) locally if you have not already.
- Build and start the stack with `docker compose up --build`. The backend becomes available on http://localhost:3001 and the frontend on http://localhost:3000.
- Stop everything with `docker compose down`; add `-v` if you also want to drop the Postgres volume.

## Render Deployment Notes

- **Backend service**: set `DATABASE_URL`, `RAILS_MASTER_KEY`, and `RAILS_ENV=production`. Provide `CORS_ORIGINS` with a comma-separated list (e.g. `https://item-management-system-frontend.onrender.com`) so the Rack::Cors initializer whitelists your frontend. The initializer always adds `http://localhost:3000` for local debugging.
- **Frontend service**: set `NEXT_PUBLIC_GRAPHQL_URL=https://item-management-system-f5bd.onrender.com/graphql` (or your custom backend domain). In production builds the Apollo client defaults to this Render endpoint, while local dev still targets `http://localhost:3001/graphql`.
- **Database**: Render’s Postgres URL plugs directly into `DATABASE_URL`; no code changes needed.

Once the env vars are configured, trigger a redeploy for each service so the new settings are picked up.

### Useful Commands

- `docker compose run --rm backend bin/rails db:migrate` — run Rails tasks.
- `docker compose exec backend bash` — open an interactive shell with all gems available.
- `docker compose exec db psql -U app -d backend_development` — connect to Postgres.
- `docker compose run --rm frontend npm run lint` — run frontend scripts against the containerized Node toolchain.

### Troubleshooting

- If gems fail to install, prune the bundle cache with `docker volume rm item-management-system_bundle_cache` and rebuild.
- When package dependencies change, rebuild the frontend container (`docker compose build frontend`) so `node_modules` is up to date.
- Rails migrations run automatically on container boot via `bin/docker-dev-entrypoint`; rerun manually if you change schema while services are running.

## Manual Local Setup (Original Notes)

The original macOS setup checklist is preserved below for reference.

```
xcode --install

brew install openssl@3 libyaml gmp rust
# openssl@3 is used for connections for things like HTTPS
# libyaml is used for faster YAML parsing
# gmp is used for faster big integer math
# rust is a programming language used to build some Ruby gems

curl https://mise.run | sh

echo 'eval "$(~/.local/bin/mise activate)"' >> ~/.zshrc
source ~/.zshrc
mise use -g ruby@3
# Use Ruby 3 globally

# rails is ruby gem, where gems are packages/libraries of ruby code, similar to npm packages for nodejs
gem install rails

brew install postgresql@14
# Install PostgreSQL version 14
brew services start postgresql@14
# Start PostgreSQL service
# To manually start PostgreSQL server, use:
pg_ctl -D /usr/local/var/postgresql@14 start

# To connect to PostgreSQL, use:
psql -h localhost -p 5432 -U zhichenglim postgres

# Create a new Rails API-only application with PostgreSQL as the database and without default testing framework
rails new backend --api -T -d postgresql
# Move into the backend directory and create the database
cd backend
bin/rails db:create
# Add GraphQL gem to the Gemfile
bundle add graphql
# Install GraphQL
bin/rails generate graphql:install

# To start the Rails server on port 3001, use:
bin/rails s -p 3001

# Create a new Next.js application with TypeScript template
npx create-next-app@latest frontend --ts

create-next-app@16.0.1
Ok to proceed? (y) y

✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack? (recommended) … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
✔ What import alias would you like configured? … @/*

# how to run the backend
cd backend
~/.local/bin/mise exec ruby@3 -- bin/rails s -p 3001
# this is because mise does not automatically activate in subshells yet

# how to run the frontend
cd frontend
npm run dev
```
