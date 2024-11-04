+++
title = "How accurate are data on the OpenAQ platform?"
type = "developers/help"
weight = 8
+++
OpenAQ is a data aggregator. We aggregate data from a variety of instruments that measure air pollution and share the pollutant measurements without modification (other than standardizing the format, e.g., converting disparate ppb to ppm). We also share metadata (descriptors that describe each instrument, such as data provider, type of instrument, company producing the instrument, and location). Sharing pollutant measurements without modification allows end users to apply their preferred correction methods; it also allows end users to compare the actual performance of air sensors with reference monitors. 

Reference monitors (aka “government monitors,” “reference-grade monitors,” “research-grade monitors”) are the gold standard \[1]. They produce very high quality, accurate data that can be used to develop and enforce regulations. Data from air sensors (aka “low-cost sensors”) vary in accuracy due to such factors as technology used, differences in validation and calibration efforts, and different weather conditions and pollution environments. Despite being less accurate than reference monitors, air sensors play an important role in advancing understanding of air quality. Because they are lower in cost, portable, and generally easier to use than reference monitors, they can be deployed more easily and can support citizen science, in particular. 

We urge anyone analyzing air sensor data to review available information on the performance of the air sensors producing the data, as well as environmental conditions that could impact measurements. Of particular note, recent studies highlight limitations in air sensors’ ability to measure greater than PM2.5 (notated as PM 2.5-10 and PM10) \[2–9].

If using air sensor data to educate, inform, advocate, or evaluate, limitations must be understood and corrections must be applied whenever possible.

References:

1. EPA scientists develop and evaluate Federal Reference & Equivalent Methods for measuring key air pollutants. Retrieved from https://www.epa.gov/air-research/epa-scientists-develop-and-evaluate-federal-reference-equivalent-methods-measuring-key. Accessed 21 February 2023. 
2. Molina Rueda, E., Carter, E., L’Orange, C., Quinn, C., & Volckens, J. (2023). Size-Resolved Field Performance of Low-Cost Sensors for Particulate Matter Air Pollution. Environmental Science & Technology Letters. https://doi.org/10.1021/acs.estlett.3c00030 
3. Hagan, D. and Kroll, J.H. (2020). Assessing the accuracy of low-cost optical particle sensors using a physics-based approach. Atmospheric Measurement Techniques, 13, 6343-6355. https://doi.org/10.5194/amt-13-6343-2020 
4. Kuula, J., Mäkelä, T., Aurela, M., Teinilä, K., Varjonen, S., González, Ó., & Timonen, H. (2020). Laboratory evaluation of particle-size selectivity of optical low-cost particulate matter sensors. Atmospheric Measurement Techniques, 13(5), 2413-2423. https://doi.org/10.5194/amt-13-2413-2020 
5. Ouimette, J. R., Malm, W. C., Schichtel, B. A., Sheridan, P. J., Andrews, E., Ogren, J. A., & Arnott, W. P. (2022). Evaluating the PurpleAir monitor as an aerosol light scattering instrument. Atmospheric Measurement Techniques, 15(3), 655-676. https://doi.org/10.5194/amt-15-655-2022. 
6. Levy Zamora, M., Xiong, F., Gentner, D., Kerkez, B., Kohrman-Glaser, J., & Koehler, K. (2018). Field and laboratory evaluations of the low-cost plantower particulate matter Sensor. Environmental science & technology, 53(2), 838-849. https://doi.org/10.1021/acs.est.8b05174 
7. Demanega, I., Mujan, I., Singer, B. C., Anđelković, A. S., Babich, F., & Licina, D. (2021). Performance assessment of low-cost environmental monitors and single sensors under variable indoor air quality and thermal conditions. Building and Environment, 187, 107415. https://doi.org/10.1016/j.buildenv.2020.107415 
8. Manikonda, A., Zíková, N., Hopke, P. K., & Ferro, A. R. (2016). Laboratory assessment of low-cost PM monitors. Journal of Aerosol Science, 102, 29-40. https://doi.org/10.1016/j.jaerosci.2016.08.010 
9. C﻿lements, A., Duvall, R. (2019). ORD SPEAR Program: Air Quality Sensors. https://www.epa.gov/sites/default/files/2020-01/documents/airsensor_evaluation_duvall_0.pdf

**Additional Resources on Correction Algorithms for Air Sensor Data:**

Barkjohn, K.K.; Holder, A.L.; Frederick, S.G.; Clements, A.L. Correction and Accuracy of PurpleAir PM2.5 Measurements for Extreme Wildfire Smoke. Sensors 2022, 22, 9669. https://doi.org/10.3390/s22249669

Jaffe, D., Miller, C., Thompson, K., Nelson, M., Finley, B., Ouimette, J., and Andrews, E.: An evaluation of the U.S. EPA’s correction equation for Purple Air Sensor data in smoke, dust and wintertime urban pollution events, Atmos. Meas. Tech. Discuss. \[preprint], https://doi.org/10.5194/amt-2022-265, in review, 2022.

Hagan, D. and Kroll, J.H. (2020). Assessing the accuracy of low-cost optical particle sensors using a physics-based approach. Atmospheric Measurement Techniques, 13, 6343-6355. https://doi.org/10.5194/amt-13-6343-2020 

McFarlane, C., Raheja, G., Malings, C., Appoh, E. K., Hughes, A. F., & Westervelt, D. M. (2021). Application of Gaussian mixture regression for the correction of low cost PM2. 5 monitoring data in Accra, Ghana. ACS Earth and Space Chemistry, 5(9), 2268-2279. https://doi.org/10.1021/acsearthspacechem.1c00217 

Venkatraman Jagatha, J.; Klausnitzer, A.; Chacón-Mateos, M.; Laquai, B.; Nieuwkoop, E.; van der Mark, P.; Vogt, U.; Schneider, C. Calibration Method for Particulate Matter Low-Cost Sensors Used in Ambient Air Quality Monitoring and Research. Sensors 2021, 21, 3960. https://doi.org/10.3390/s21123960

Kosmopoulos, G., Salamalikis, V., Pandis, S. N., Yannopoulos, P., Bloutsos, A. A., & Kazantzidis, A. (2020). Low-cost sensors for measuring airborne particulate matter: Field evaluation and calibration at a South-Eastern European site. Science of The Total Environment, 748, 141396. https://doi.org/10.1016/j.scitotenv.2020.141396 

Diez, S., Lacy, S. E., Bannan, T. J., Flynn, M., Gardiner, T., Harrison, D., Marsden, N., Martin, N. A., Read, K., and Edwards, P. M.: Air pollution measurement errors: is your data fit for purpose?, Atmos. Meas. Tech., 15, 4091–4105, https://doi.org/10.5194/amt-15-4091-2022, 2022. 

US EPA (2022). How to Use Air Sensors: The Enhanced Air Sensor Guidebook. https://www.epa.gov/air-sensor-toolbox/how-use-air-sensors-air-sensor-guidebook
