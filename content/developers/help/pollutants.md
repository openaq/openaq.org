+++
type = "developers/help"
title = "What pollutants are available on OpenAQ?"
weight = 3
+++

The OpenAQ database currently ingests the following pollutant data, with a focus on those in **bold**.

* PM1 - particulate matter 1 microns (μm)
* **PM2.5 - particulate matter 2.5 microns (μm)**
* PM4 - particulate matter 4 microns (μm)
* **PM10 - particulate matter 10 microns (μm)**
* **BC - black carbon particulates, part of PM2.5**
* **O₃ - Ozone gas**
* **CO - Carbon monoxide gas**
* **NO₂ - Nitrogen dioxide gas**
* NO - Nitrogen monoxide gas
* NOx - Nitrogen oxides
* **SO₂ - Sulfur dioxide gas**
* CH₄ - Methane gas
* CO₂ - Carbon dioxide gas  

For information on these pollutants, their sources, their health risks, and recommended guideline values, visit World Health Organization's "Types of pollutants" [web page](https://www.who.int/teams/environment-climate-change-and-health/air-quality-and-health/health-impacts/types-of-pollutants). Britannica's [air pollution page](https://www.britannica.com/science/air-pollution) is another good source of information on air and climate pollutants.

## Units of measurement
Measurements of pollutants are reported in a variety of units depending on how the data is reported from the original data provider. Units are not normalized in the OpenAQ system, with the exception of converting ppm (parts per million) to ppb (parts per billion). Volume units are not converted to mass units, nor vice versa; they are served as originally reported.
