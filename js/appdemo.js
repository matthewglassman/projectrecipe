   $(document).ready(function(){
      $('.slider').slider({full_width: true});
    });

// Pause slider
$('.slider').slider('pause');
// Start slider
$('.slider').slider('start');
// Next slide
$('.slider').slider('next');
// Previous slide
$('.slider').slider('prev');

$('.flexdatalist').flexdatalist({
     minLength: 1,
     textProperty: '{capital}, {name}, {continent}',
     valueProperty: 'id',
     selectionRequired: true,
     visibleProperties: ["name","capital","continent"],
     searchIn: 'name',
     data: 'countries.json'
});
