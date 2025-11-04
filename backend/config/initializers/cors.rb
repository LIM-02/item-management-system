# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

frontend_origin = ENV.fetch("FRONTEND_ORIGIN", "https://item-management-system-frontend.onrender.com")

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow requests from the deployed frontend and local dev
    origins frontend_origin, "http://localhost:3000"

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: false
  end
end
