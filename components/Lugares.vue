<template>
    <div class="card">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#latacunga" role="tab" aria-controls="latacunga" aria-selected="true">Latacunga</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#ambato" role="tab" aria-controls="ambato" aria-selected="false">Ambato</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="contact-tab" data-toggle="tab" href="#riobamba" role="tab" aria-controls="riobamba" aria-selected="false">Riobamba</a>
            </li>
            <li class="nav-item" role="presentation">
                <a class="nav-link" id="contact-tab" data-toggle="tab" href="#banos" role="tab" aria-controls="banos" aria-selected="false">Baños</a>
            </li>
        </ul>
        <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="latacunga" role="tabpanel" aria-labelledby="latacunga-tab">...</div>
            <div class="tab-pane fade" id="ambato" role="tabpanel" aria-labelledby="profile-tab">
                <!-- Three columns of text below the carousel -->
                <div class="row">
                    <div class="col-lg-4" v-for="destino in destinosList[0].atractivos" :key="destino.id">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Heading</h2>
                        <p>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.</p>
                        <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                    </div>
                    <!-- /.col-lg-4 -->
                    <div class="col-lg-4">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Heading</h2>
                        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
                            nibh.
                        </p>
                        <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                    </div>
                    <!-- /.col-lg-4 -->
                    <div class="col-lg-4">
                        <svg class="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 140x140"><title>Placeholder</title><rect width="100%" height="100%" fill="#777"/><text x="50%" y="50%" fill="#777" dy=".3em">140x140</text></svg>
                        <h2>Heading</h2>
                        <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum
                            massa justo sit amet risus.</p>
                        <p><a class="btn btn-secondary" href="#" role="button">View details &raquo;</a></p>
                    </div>
                    <!-- /.col-lg-4 -->
                </div>
                <!-- /.row -->
            </div>
            <div class="tab-pane fade" id="riobamba" role="tabpanel" aria-labelledby="riobamba-tab">
                <div class="row">
                    <div class="col-md-4">
                        <div class="card mb-4 shadow-sm">
                            <img src="img/rio-parque.png" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="Parque Maldonado">
                            <div class="card-body">
                                <p class="card-text">La construcción empezó en el año 1909, bajo la dirección del arquitecto italiano Francisco Manuel Durini y culminaron en junio de 1917...</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary">Ver</button>
                                    </div>
                                    <small class="text-muted">Riobamba - Chimborazo</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card mb-4 shadow-sm">
                            <img src="img/rio-museo.png" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="Casa Museo Riobamba">
                            <div class="card-body">
                                <p class="card-text">El Museo de la Ciudad, es un espacio destinado a la exposición de muestras temporales y permanentes de fotografía, pintura, escultura y arte contemporáneo.</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary">Ver</button>
                                    </div>
                                    <small class="text-muted">Riobamba - Chimborazo</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card mb-4 shadow-sm">
                            <img src="img/rio-catedral.png" class="bd-placeholder-img card-img-top" width="100%" height="225" alt="La Catedral">
                            <div class="card-body">
                                <p class="card-text">La fachada de la Catedral es una reliquia histórica, fue rescatada de los escombros de la antigua Riobamba, destruida en el terremoto de 1797. </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                                    </div>
                                    <small class="text-muted">Riobamba - Chimborazo</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tab-pane fade" id="banos" role="tabpanel" aria-labelledby="banos-tab">...</div>
            </div>
        </div>
    </div>
</template>