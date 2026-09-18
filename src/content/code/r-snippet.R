library("openaq")

locations <- openaq::list_locations(
  parameters_id = 2,
  radius = 100,
  coordinates = c(latitude = -73.0666, longitude = -36.7724)
)
