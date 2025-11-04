# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://item-management-system-frontend.onrender.com", "http://localhost:3000"

    resource "/graphql",
      headers: :any,
      methods: [:post, :options],
      max_age: 600,
      credentials: false
  end
end
