const app = new Vue({
    el: '#main',
    data: {
        baseUrl: 'http://eturismo.local/',
        data_url: 'data.json',
        data: {},
        destinosList: [],
        ambatoList: [],
        latacungaList: [],
        riobambaList: [],
        banosList: [],
        viewer: null,
        pinBuilder: null,
        lat: 0,
        lng: 0,
        altura: 0
            //baseUrl: 'http://wekain.com/',
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

            }).catch(function(error) {
                console.log(error);
            });
        },
        initMapa: function() {
            var me = this;
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NGU0MzhiZS1jOWMxLTRmZDEtODk0ZS00NjE1NDkzNTM2YWIiLCJpZCI6ODMzLCJpYXQiOjE1MjU5ODE3Mjd9.Wi5bheKDoVv0FU8HHgnf5w4XOjke2pXQFTlEBu27E-Q';
            this.viewer = new Cesium.Viewer('cesiumContainer');
            this.pinBuilder = new Cesium.PinBuilder();

            var coords = {
                latitude: -1.26037,
                longitude: -78.615184
            };

        },
        loadPlaces: function() {
            var me = this;
            for (let index = 0; index < this.destinosList.length; index++) {
                const d = this.destinosList[index];
                for (let index2 = 0; index2 < d.atractivos.length; index2++) {
                    const a = d.atractivos[index2];
                    console.log(a.longitud + ' : ' + a.latitud);
                    var heading = Cesium.Math.toRadians(135.0);
                    var pitch = Cesium.Math.toRadians(90.0);
                    var roll = Cesium.Math.toRadians(0.0);
                    var punto = new Cesium.Cartesian3.fromDegrees(a.longitud, a.latitud, a.altura);

                    var orientation = Cesium.Transforms.headingPitchRollQuaternion(punto, new Cesium.HeadingPitchRoll(heading, pitch, roll));

                    var bluePin = me.viewer.entities.add({
                        id: a.id,
                        name: a.atractivo,
                        orientation: orientation,
                        position: Cesium.Cartesian3.fromDegrees(a.longitud, a.latitud),
                        model: {
                            uri: 'img/pin.glb',
                            scale: 10
                        },
                        /*billboard: {
                            image: me.pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        },*/
                    });
                }
            }
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
        },
        flyToDestino: function(index) {
            var destino = this.destinosList[index];
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(destino.longitud, destino.latitud, 5000),
                duration: 5,
                complete: function() {
                    alert('Destino ' + destino.ruta);
                }
            });
        },
        atractivoHover: function(id) {
            console.log('hover: ' + id);
            var entidad = this.viewer.entities.getById(id);

            //console.log(entidad);
            //console.log(entidad.billboard);
            //console.log(entidad.billboard.image);
            //console.log(entidad.billboard.image);
            //console.log(entidad.tipo);
            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALRED, 96).toDataURL();
            //console.log(entidad.billboard.image);
            entidad.model.scale = (entidad.model.scale * 2);

        },
        atractivoLeave: function(id) {
            console.log('leave: ' + id);
            var entidad = this.viewer.entities.getById(id);

            //entidad.billboard.image = this.pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL();
            entidad.model.scale = 10;
        }
    },
    mounted() {
        this.loadData();

    },
});