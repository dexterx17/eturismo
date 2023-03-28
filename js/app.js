const app = new Vue({
    el: '#main',
    data: {
        baseUrl: 'http://localhost:3000/',
        //baseUrl: 'http://eturismo.local/',
        //baseUrl: 'http://wao.santana.ec/',
        data_url: 'data.json',
        data: {},
        destinosList: [],
        ambatoList: [],
        latacungaList: [],
        riobambaList: [],
        banosList: [],
        viewer: null,
        pinBuilder: null,
        selectedEntity: null,
        showSidebar: true,
        activeTab:'home',
        debugID: 16,
        //clock
        start:0,
        stop:0,
        //coordenadas mouse
        lat: 0,
        lng: 0,
        altura: 0,
        //orientacion camara
        heading: 0,
        pitch: 0,
        roll: 0,
        markerPosition: {
            lat: 0,
            lng: 0,
            altura: 0,
            heading: 0,
            pitch: 0,
            roll: 0,
            scale: 0
        },
        cameraPosition: {
            lat: 0,
            lng: 0,
            altura: 0,
            heading: 0,
            pitch: 0,
            roll: 0,
        },
    },
    methods: {
        loadData: function () {
            var me = this;
            var url = this.baseUrl + this.data_url;
            axios.get(url).then(function (response) {
                me.data = response.data;
                me.destinosList = me.data.destinos;
                me.latacungaList = me.data.destinos[0];
                me.ambatoList = me.data.destinos[1];
                me.riobambaList = me.data.destinos[2];
                me.banosList = me.data.destinos[3];
                me.initMapa();
                me.loadPlaces();
                me.debugMode();
            }).catch(function (error) {
                console.log(error);
            });
        },
        initMapa: function () {
            var me = this;
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NGU0MzhiZS1jOWMxLTRmZDEtODk0ZS00NjE1NDkzNTM2YWIiLCJpZCI6ODMzLCJpYXQiOjE1MjU5ODE3Mjd9.Wi5bheKDoVv0FU8HHgnf5w4XOjke2pXQFTlEBu27E-Q';
            this.viewer = new Cesium.Viewer('cesiumContainer', {
                terrainProvider: Cesium.createWorldTerrain(),
                timeline: false,
                shouldAnimate: true, // Enable animations
            });

            //Enable lighting based on the sun position
            this.viewer.scene.globe.enableLighting = true;

            //Enable depth testing so things behind the terrain disappear.
            this.viewer.scene.globe.depthTestAgainstTerrain = true;


            this.pinBuilder = new Cesium.PinBuilder();

            var coords = {
                latitude: -1.26037,
                longitude: -78.615184
            };


            //Set the random number seed for consistent results.
            Cesium.Math.setRandomNumberSeed(3);

            //Set bounds of our simulation time
            this.start = Cesium.JulianDate.fromDate(new Date(2023, 3, 29, 16));
            this.stop = Cesium.JulianDate.addSeconds(
                this.start,
                360,
                new Cesium.JulianDate()
            );

            //Make sure viewer is at the desired time.
            this.viewer.clock.startTime = this.start.clone();
            this.viewer.clock.stopTime = this.stop.clone();
            this.viewer.clock.currentTime = this.start.clone();
            this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
            this.viewer.clock.multiplier = 10;


            //Compute the entity position property.
            const position = this.computePathFlight(-77.011694584096, -1.02219706401149, 0.005);

            //Actually create the entity
            const entity = this.viewer.entities.add({
                //Set the entity availability to the same interval as the simulation time.
                availability: new Cesium.TimeIntervalCollection([
                    new Cesium.TimeInterval({
                    start: this.start,
                    stop: this.stop,
                    }),
                ]),

                //Use our computed positions
                position: position,

                //Automatically compute orientation based on position movement.
                orientation: new Cesium.VelocityOrientationProperty(position),

                //Load the Cesium plane model to represent the entity
                model: {
                    uri: "models/Cesium_Air.glb",
                    minimumPixelSize: 64,
                },

                //Show the path as a pink line sampled in 1 second increments.
                path: {
                    resolution: 1,
                    material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.1,
                    color: Cesium.Color.YELLOW,
                    }),
                    width: 10,
                },
            });

            entity.position.setInterpolationOptions({
                interpolationDegree: 5,
                interpolationAlgorithm:
                  Cesium.LagrangePolynomialApproximation,
              });

        },
        loadPlaces: function () {
            var me = this;
            for (let index = 0; index < this.destinosList.length; index++) {
                //for (let index = 0; index < 1; index++) {
                const d = this.destinosList[index];
                for (let index2 = 0; index2 < d.atractivos.length; index2++) {
                    //    for (let index2 = 0; index2 < 1; index2++) {
                    const a = d.atractivos[index2];
                    //console.log(a.longitud + ' : ' + a.latitud);
                    var heading = Cesium.Math.toRadians(a.model.heading);
                    var pitch = Cesium.Math.toRadians(a.model.pitch);
                    var roll = Cesium.Math.toRadians(a.model.roll);

                    var punto = new Cesium.Cartesian3.fromDegrees(a.longitud, a.latitud, a.altura);

                    var orientation = Cesium.Transforms.headingPitchRollQuaternion(punto, new Cesium.HeadingPitchRoll(heading, pitch, roll));

                    me.selectedEntity = me.viewer.entities.add({
                        id: a.id,
                        name: a.atractivo,
                        orientation: orientation,
                        position: punto,
                        description: '\
                        <img\
                          width="50%"\
                          style="float:left; margin: 0 1em 1em 0;"\
                          src="img/' + a.imagen + '"/>\
                        <p>\
                         ' + a.sector + '<br>\
                         ' + a.provincia + ', ' + a.ciudad + ' \
                        </p>\
                        <p style="text-align: justify;">' + a.descripcion + '</p>\
                        <p>\
                          <a style="color: WHITE"\
                            target="_blank"\
                            href="' + a.link + '">Más información</a>\
                        </p>',
                        model: {
                            uri: 'models/' + a.model.url,
                            scale: a.model.scale
                            // color: Cesium.Color.CHARTREUSE
                        },
                        label: {
                            text: a.atractivo,
                            showBackground: true,
                            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                            verticalOrigin: Cesium.VerticalOrigin.TOP,
                            hightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                            translucencyByDistance: new Cesium.NearFarScalar(1.5e5, 1.0, 1.5e7, 0.0),
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(500.0, 1500.0),
                            eyeOffset: new Cesium.Cartesian3(0, 0, -200)
                            //pixeloffset : new Cesium.Cartesian2(500, 205),
                            //scaleByDistance : new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
                            //pixelOffsetScaleByDistance : new Cesium.NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5)
                        }
                    });
                }
            }
        },
        initMarker() { },
        updateMarker() {
            var entidad = this.viewer.entities.getById(this.debugID);
            var heading = Cesium.Math.toRadians(this.markerPosition.heading);

            var pitch = Cesium.Math.toRadians(this.markerPosition.pitch);

            var roll = Cesium.Math.toRadians(this.markerPosition.roll);

            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var punto = new Cesium.Cartesian3.fromDegrees(this.markerPosition.lng, this.markerPosition.lat, this.markerPosition.altura);

            var orientation = Cesium.Transforms.headingPitchRollQuaternion(punto, hpr);
            console.log('updateMarker');
            console.log(punto);
            console.log(orientation);
            entidad.position = punto;
            entidad.orientation = orientation;
            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL();
            entidad.model.scale = this.markerPosition.scale;
        },
        updateCamera() {
            var heading = Cesium.Math.toRadians(this.cameraPosition.heading);

            var pitch = Cesium.Math.toRadians(this.cameraPosition.pitch);

            var roll = Cesium.Math.toRadians(this.cameraPosition.roll);

            var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
            var punto = new Cesium.Cartesian3.fromDegrees(this.cameraPosition.lng, this.cameraPosition.lat, this.cameraPosition.altura);

            var orientation = Cesium.Transforms.headingPitchRollQuaternion(punto, hpr);


            console.log('updateCamera');
            console.log(punto);
            console.log(orientation);
            this.viewer.camera.lookAt(punto, new Cesium.HeadingPitchRange(heading, pitch, this.cameraPosition.altura));
            //this.viewer.camera.orientation = orientation;
        },
        debugMode: function () {
            var me = this;
            // Mouse over the globe to see the cartographic position
            var handler = new Cesium.ScreenSpaceEventHandler(me.viewer.scene.canvas);
            handler.setInputAction(function (movement) {
                var cartesian = me.viewer.camera.pickEllipsoid(movement.endPosition, me.viewer.scene.globe.ellipsoid);
                if (cartesian) {
                    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
                    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
                    me.lat = latitudeString;
                    me.lng = longitudeString;

                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            var handler = new Cesium.ScreenSpaceEventHandler(me.viewer.scene.canvas, false);
            handler.setInputAction(function (movement) {
                var ray = me.viewer.camera.getPickRay(movement.endPosition);
                var position = me.viewer.scene.globe.pick(ray, me.viewer.scene);
                if (Cesium.defined(position)) {
                    var positionCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                    me.altura = positionCartographic.height.toFixed(2) + ' msnm';
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            me.viewer.camera.moveEnd.addEventListener(function () {
                console.log('END:')
                // the camera stopped moving
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.heading))
                me.heading = deg;
                me.cameraPosition.heading = deg;
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.pitch))
                me.pitch = deg;
                me.cameraPosition.pitch = deg;
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.roll))
                me.roll = deg;
                me.cameraPosition.roll = deg;
            });
        },
        flyToDestino: function (destino, close = false) {
            if (close) {
                $('#bienvenida').modal('hide');
            }
            this.showSidebar = false;

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(destino.longitud, destino.latitud, destino.altura),
                orientation: {
                    heading: Cesium.Math.toRadians(destino.orientacion.heading),
                    pitch: Cesium.Math.toRadians(destino.orientacion.pitch),
                    roll: destino.orientacion.roll
                },
                duration: 5,
                complete: function () {
                    swal({
                        title: destino.ruta,
                        text: "Bienvenido a " + destino.nombre + '.',
                        button: "Explorar",
                    });
                }
            });

            this.cameraPosition.lat = destino.latitud
            this.cameraPosition.lng = destino.longitud
            this.cameraPosition.altura = destino.altura
            this.cameraPosition.heading = destino.orientacion.heading
            this.cameraPosition.pitch = destino.orientacion.pitch
            this.cameraPosition.roll = destino.orientacion.roll
        },
        flyToAtractivo: function (atractivo, close = false) {
            if (close) {
                $('#bienvenida').modal('hide');
            }
            this.showSidebar = false;
            var me = this;
            var entidad = this.viewer.entities.getById(atractivo.id);

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(atractivo.longitud, atractivo.latitud, atractivo.altura + 500),
                duration: 5,
                complete: function () {

                    me.viewer.zoomTo(entidad);
                    //var pickedFeature = me.viewer.scene.pick(entidad.position);
                    //console.log(pickedFeature);
                }
            });



            this.debugID = atractivo.id;
            this.markerPosition.heading = atractivo.model.heading;
            this.markerPosition.pitch = atractivo.model.pitch;
            this.markerPosition.roll = atractivo.model.roll;
            this.markerPosition.lat = atractivo.latitud;
            this.markerPosition.lng = atractivo.longitud;
            this.markerPosition.altura = atractivo.altura;
            this.markerPosition.scale = atractivo.model.scale;
        },
        atractivoHover: function (atractivo) {
            var entidad = this.viewer.entities.getById(atractivo.id);

            //console.log(entidad);
            //console.log(entidad.billboard);
            //console.log(entidad.billboard.image);
            //console.log(entidad.billboard.image);
            //console.log(entidad.tipo);
            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALRED, 96).toDataURL();
            //console.log(entidad.billboard.image);
            entidad.model.scale = (entidad.model.scale * 2);
            //entidad.model.color = Cesium.Color.FUCHSIA;

        },
        atractivoLeave: function (atractivo) {
            var entidad = this.viewer.entities.getById(atractivo.id);

            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL();
            entidad.model.scale = atractivo.model.scale;
            //entidad.model.color = Cesium.Color.CHARTREUSE;
        },
        computePathFlight(lon, lat, radius){
            const property = new Cesium.SampledPositionProperty();
            for (let i = 0; i <= 360; i += 45) {
              const radians = Cesium.Math.toRadians(i);
              const time = Cesium.JulianDate.addSeconds(
                this.start,
                i,
                new Cesium.JulianDate()
              );
              const position = Cesium.Cartesian3.fromDegrees(
                lon + radius * 1.5 * Math.cos(radians),
                lat + radius * Math.sin(radians),
                400
                //(Cesium.Math.nextRandomNumber() * 400 - 300 ) +300
              );
              property.addSample(time, position);
          
              //Also create a point for each sample we generate.
              this.viewer.entities.add({
                position: position,
                point: {
                  pixelSize: 8,
                  color: Cesium.Color.TRANSPARENT,
                  outlineColor: Cesium.Color.YELLOW,
                  outlineWidth: 3,
                },
              });
            }
            return property;
        }
    },
    mounted() {
        this.loadData();
    },
});