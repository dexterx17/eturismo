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
            }).catch(function(error) {
                console.log(error);
            });
        },
        initMapa: function() {
            Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NGU0MzhiZS1jOWMxLTRmZDEtODk0ZS00NjE1NDkzNTM2YWIiLCJpZCI6ODMzLCJpYXQiOjE1MjU5ODE3Mjd9.Wi5bheKDoVv0FU8HHgnf5w4XOjke2pXQFTlEBu27E-Q';
            this.viewer = new Cesium.Viewer('cesiumContainer');

            var coords = {
                latitude: -1.26037,
                longitude: -78.615184
            };

            var pinBuilder = new Cesium.PinBuilder();
            this.viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude, 500),
                duration: 5,
                complete: function() {

                    var bluePin = this.viewer.entities.add({
                        name: "Mi Ubicación",
                        position: Cesium.Cartesian3.fromDegrees(coords.longitude, coords.latitude),
                        billboard: {
                            image: pinBuilder.fromColor(Cesium.Color.ROYALBLUE, 48).toDataURL(),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        },
                    });

                }
            })
        }
    },
    mounted() {
        this.loadData();
    },
});