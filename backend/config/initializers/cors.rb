# backend/config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # ----------------------------------------------------------------------
    # 1. Allowed origins
    # ----------------------------------------------------------------------
    # • Production front-end (the one that is giving you the error)
    # • Local dev front-end (so you can keep developing locally)
    # Add any staging URLs later the same way.
    origins(
      "https://item-management-system.onrender.com",
      "https://item-management-system-frontend.onrender.com", # <-- if you ever use this
      "http://localhost:3000"
    )

    # ----------------------------------------------------------------------
    # 2. Which resources are allowed?
    # ----------------------------------------------------------------------
    # Only the GraphQL endpoint – more secure than "*"
    resource "/graphql",
      headers: :any,                     # any request header is fine
      methods: %i[get post options],     # GraphQL uses POST, browsers send OPTIONS pre-flight
      expose:  %w[Access-Control-Allow-Origin],
      credentials: false                 # change to true only if you send cookies/auth
  end
end