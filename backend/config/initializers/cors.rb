# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

default_origin = "https://item-management-system-frontend.onrender.com"
raw_origins = ENV.fetch("CORS_ORIGINS", default_origin)
allowed_origins = raw_origins.split(",").map(&:strip).reject(&:empty?)
allowed_origins << "http://localhost:3000"
allowed_origins.uniq!

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow requests from the deployed frontend and local dev
    origins(*allowed_origins)

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: false
  end
end
