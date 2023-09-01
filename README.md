# Hur man testar detta API

Detta API är driftsatt här: [https://cscloud8-26.lnu.se/api](https://cscloud8-26.lnu.se/api)

Det kan testas i Postman med hjälp av de filer som finns i mappen postmanCollection i detta repo. I mappen finns både en environment-fil och en postman collection-fil.

Filen innehåller tester för alla ändpunkter samt för ett urval av error. Dessvärre Fungerar inte returen av felkoder på samma sätt driftsatt som det gjorde under utveckling och jag har inte hunnit lösa detta. De flesta fel ger felkoden 500, trots att det borde ge en annan felkod, exempelvis 404 då en resurs inte hittas. Se bifogad bild i image mappen.

 	![404 error lokalt](/image/404.png)