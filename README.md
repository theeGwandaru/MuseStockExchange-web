#Synopsis
A stock exchange platform modeled after the Narirobi Securities Exchange. 
This provides the AngularJS client . See https://github.com/MosesMunene/MuseStockExchange for REST API.

#Motivation
 - To experiment with AngularJS (1.5.8) and get familirized with pitfalls, gotchas and design patterns of the approach.
 - Also, I am tired of Java Server Faces.

 #Criticism and comments 
 These are very much welcomed. Post them as isssues and they will be worked on
 
 #Dev Tools
 - Visual Studio Code
 - Apache HTTP Server
 
 #Installation
 - Clone this repo into Apache htdocs folder.
 - Activate revers proxy modules on  Apache by uncommenting the following lines in http.conf
 
~~~~
	LoadModule negotiation_module modules/mod_negotiation.so
	LoadModule proxy_module modules/mod_proxy.so
	LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
	LoadModule proxy_http_module modules/mod_proxy_http.so
~~~~

 - Set virtual Host as follows
 ~~~~
 Listen 127.0.0.1:9095
<VirtualHost *:9095>
    DocumentRoot "C:/Apache24/htdocs/MuseStockExchange-web/"
	ProxyRequests Off
	ProxyPreserveHost On
	
	<Proxy *>
		 Require all granted
	</Proxy>
	
	ProxyPass /api/ http://localhost:8080/MuseStockExchange/
</VirtualHost>
~~~~~
 
 #Tests
comming soon
