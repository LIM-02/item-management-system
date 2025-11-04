# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    allowed = ENV.fetch("CORS_ORIGINS", "")
                 .split(/[,\s]+/)
                 .map(&:strip)
                 .reject(&:empty?)

    origins(*allowed)

    resource "/graphql",
      headers: :any,
      methods: [:post, :options],
      max_age: 600,
      credentials: false
  end
end