phl-ready
=========

Proof-of-Concept Javascript application to monitor flight status and traffic conditions on a route to the Philadelphia International Airport, notifies you when you should leave.

View the app at http://mmcfarland.github.io/phl-ready

#####Features

* WebSocket connection to PHL flight data server to update realtime flight status changes
* Polling Google directions service for updated travel times with traffic
* Descriptive time to leave updates based on the two information sources
* Browser alert when you should leave.  Should reactivate the tab if you have the browser open.

#####Enhancements

* Alter time to leave based on Departure/Arrival (arrive at airport 2 hours early for flight, for example)
* Alter time for International pick up (allow longer time for customs)
* Enable text message notification
