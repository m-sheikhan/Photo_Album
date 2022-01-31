var viewModel={
    name: 'Jason',
    helpers: {
        timeago: function(timestamp){
            return 'A long time ago'
        }
    }
}
res.render('index',viewModel);