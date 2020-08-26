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
        }
    },
    mounted() {
        this.loadData();
    },
});