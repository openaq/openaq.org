library("openaq")

locations <- openaq::list_locations(
  parameters_id = 2,
  radius = 100,
  coordinates = c(latitude = -36.7724, longitude = -73.0666)
)
