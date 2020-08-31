const app = new Vue({
    el: '#main',
    data: {
        baseUrl: 'http://eturismo.local/',
        //baseUrl: 'http://jaime.santana.ec/eturismo/',
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
        debugID: 17,
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
        }
    },
    methods: {
        loadData: function() {
            var me = this;
            var url = this.baseUrl + this.data_url;
            axios.get(url).then(function(response) {
                me.data = response.data;
                me.destinosList = me.data.destinos;
                me.latacungaList = me.data.destinos[0];
                me.ambatoList = me.data.destinos[1];
                me.riobambaList = me.data.destinos[2];
                me.banosList = me.data.destinos[3];
                me.initMapa();
                me.loadPlaces();
                me.debugMode();
            }).catch(function(error) {
                console.log(error);
            });
        },
        initMapa: function() {
            var me = this;
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NGU0MzhiZS1jOWMxLTRmZDEtODk0ZS00NjE1NDkzNTM2YWIiLCJpZCI6ODMzLCJpYXQiOjE1MjU5ODE3Mjd9.Wi5bheKDoVv0FU8HHgnf5w4XOjke2pXQFTlEBu27E-Q';
            this.viewer = new Cesium.Viewer('cesiumContainer', {
                terrainProvider: Cesium.createWorldTerrain(),
                timeline: false
            });

            this.pinBuilder = new Cesium.PinBuilder();

            var coords = {
                latitude: -1.26037,
                longitude: -78.615184
            };

        },
        loadPlaces: function() {
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
        initMarker() {},
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
        debugMode: function() {
            var me = this;
            // Mouse over the globe to see the cartographic position
            var handler = new Cesium.ScreenSpaceEventHandler(me.viewer.scene.canvas);
            handler.setInputAction(function(movement) {
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
            handler.setInputAction(function(movement) {
                var ray = me.viewer.camera.getPickRay(movement.endPosition);
                var position = me.viewer.scene.globe.pick(ray, me.viewer.scene);
                if (Cesium.defined(position)) {
                    var positionCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
                    me.altura = positionCartographic.height.toFixed(2) + ' msnm';
                }
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            me.viewer.camera.moveEnd.addEventListener(function() {
                console.log('END:')
                    // the camera stopped moving
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.heading))
                me.heading = deg;
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.pitch))
                me.pitch = deg;
                var deg = Math.round(Cesium.Math.toDegrees(me.viewer.camera.roll))
                me.roll = deg;
            });
        },
        flyToDestino: function(destino, close = false) {
            if (close) {
                $('#bienvenida').modal('hide');
            }

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(destino.longitud, destino.latitud, destino.altura),
                orientation: {
                    heading: Cesium.Math.toRadians(destino.orientacion.heading),
                    pitch: Cesium.Math.toRadians(destino.orientacion.pitch),
                    roll: destino.orientacion.roll
                },
                duration: 5,
                complete: function() {
                    swal({
                        title: destino.ruta,
                        text: "Bienvenido a " + destino.nombre + '.',
                        button: "Explorar",
                    });
                }
            });
        },
        flyToAtractivo: function(atractivo, close = false) {
            if (close) {
                $('#bienvenida').modal('hide');
            }
            var me = this;
            var entidad = this.viewer.entities.getById(atractivo.id);

            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(atractivo.longitud, atractivo.latitud, atractivo.altura + 500),
                duration: 5,
                complete: function() {

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
        atractivoHover: function(atractivo) {
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
        atractivoLeave: function(atractivo) {
            var entidad = this.viewer.entities.getById(atractivo.id);

            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL();
            entidad.model.scale = atractivo.model.scale;
            //entidad.model.color = Cesium.Color.CHARTREUSE;
        }
    },
    mounted() {
        this.loadData();
    },
});