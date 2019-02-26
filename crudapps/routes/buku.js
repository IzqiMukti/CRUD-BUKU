var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF BUKU
app.get('/', function(req, res, next) {
    req.db.collection('buku').find().sort({"_id": -1}).toArray(function(err, result) {
        //if (err) return console.log(err)
        if (err) {
            req.flash('error', err)
            res.render('buku/listbuku', {
                title: 'Daftar Buku',
                data: ''
            })
        } else {
            res.render('buku/listbuku', {
                title: 'Daftar Buku',
                data: result
            })
        }
    })
})

// SHOW ADD BUKU FORM
app.get('/add', function(req, res, next){
    res.render('buku/add', {
        title: 'Tambah Buku',
        judul: '',
        penulis: '',
        tahun: '',
        genre:'',
        harga:'',
        stok:''
    })
})

// ADD NEW MAHASISWA POST ACTION
app.post('/add', function(req, res, next){
    req.assert('judul', 'Judul is required').notEmpty()
    req.assert('penulis', 'Penulis is required').notEmpty()
    req.assert('tahun', 'Tahun is required').notEmpty()
    req.assert('genre', 'Genre is required').notEmpty()
    req.assert('harga', 'Harga is required').notEmpty()
    req.assert('stok', 'Stok is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        var buku = {
            judul: req.sanitize('judul').escape().trim(),
            penulis: req.sanitize('penulis').escape().trim(),
            tahun: req.sanitize('tahun').escape().trim(),
            genre : req.sanitize('genre').escape().trim(),
            harga : req.sanitize('harga').escape().trim(),
            stok : req.sanitize('stok').escape().trim()
        }

        req.db.collection('buku').insert(buku, function(err, result) {
            if (err) {
                req.flash('error', err)


                res.render('buku/add', {
                    title: 'Tambah Buku Baru',
                    judul: buku.judul,
                    penulis: buku.penulis,
                    tahun: buku.tahun,
                    genre: buku.genre,
                    harga: buku.harga,
                    stok: buku.stok
                })
            } else {
                req.flash('success', 'Data Berhasil Ditambah!')


                res.redirect('/buku')


            }
        })
    }
    else {   //Display errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('buku/add', {
            title: 'Tambah Buku Baru',
            judul: buku.judul,
            penulis: buku.penulis,
            tahun: buku.tahun,
            genre: buku.genre,
            harga: buku.harga,
            stok: buku.stok
        })
    }
})

// SHOW EDIT MAHASISWA FORM
app.get('/edit/(:id)', function(req, res, next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').find({"_id": o_id}).toArray(function(err, result) {
        if(err) return console.log(err)

        // if MAHASISWA not found
        if (!result) {
            req.flash('error', 'Buku tidak ada dengan id = ' + req.params.id)
            res.redirect('/buku')
        }
        else { // if MAHASISWA found

            res.render('buku/edit', {
                title: 'Edit buku',
                //data: rows[0],
                id: result[0]._id,
                judul: result[0].judul,
                penulis: result[0].penulis,
                tahun: result[0].tahun,
                genre: result[0].genre,
                harga: result[0].harga,
                stok: result[0].stok
            })
        }
    })
})

// EDIT MAHASISWA POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
  req.assert('judul', 'Judul is required').notEmpty()           //Validate name
  req.assert('penulis', 'Penulis is required').notEmpty()             //Validate age
  req.assert('tahun', 'Tahun is required').notEmpty()       //Validate email
  req.assert('genre', 'Genre is required').notEmpty()
  req.assert('harga', 'Harga is required').notEmpty()
  req.assert('stok', 'Stok is required').notEmpty()


    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!


        var buku = {
            judul: req.sanitize('judul').escape().trim(),
            penulis: req.sanitize('penulis').escape().trim(),
            tahun: req.sanitize('tahun').escape().trim(),
            genre: req.sanitize('genre').escape().trim(),
            harga: req.sanitize('harga').escape().trim(),
            stok: req.sanitize('stok').escape().trim()
        }

        var o_id = new ObjectId(req.params.id)
        req.db.collection('buku').update({"_id": o_id}, buku, function(err, result) {
            if (err) {
                req.flash('error', err)


                res.render('user/edit', {
                    title: 'Edit User',
                    id: req.params.id,
                    judul: req.body.judul,
                    penulis: req.body.penulis,
                    tahun: req.body.tahun,
                    genre: req.body.genre,
                    harga: req.body.harga,
                    stok: req.body.stok
                })
            } else {
                req.flash('success', 'Data berhasil diupdate!')

                res.redirect('/buku')


            }
        })
    }
    else {   //Display errors
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)


        res.render('buku/edit', {
            title: 'Edit Buku',
            id: req.params.id,
            judul: req.body.judul,
            penulis: req.body.penulis,
            tahun: req.body.tahun,
            genre: req.body.genre,
            harga: req.body.harga,
            stok: req.body.stok
        })
    }
})

// DELETE MAHASISWA
app.delete('/delete/(:id)', function(req, res, next) {
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').remove({"_id": o_id}, function(err, result) {
        if (err) {
            req.flash('error', err)
            // redirect to MAHASISWA list page
            res.redirect('/buku')
        } else {
            req.flash('success', 'Buku telah terhapus! id = ' + req.params.id)
            // redirect to MAHASISWA list page
            res.redirect('/buku')
        }
    })
})
   // SHOW EDIT MAHASISWA FORM
app.get('/detail/(:id)', function(req, res, next){
    var o_id = new ObjectId(req.params.id)
    req.db.collection('buku').find({"_id": o_id}).toArray(function(err, result) {
        if(err) return console.log(err)

        // if MAHASISWA not found
        if (!result) {
            req.flash('error', 'Buku tidak ada dengan id = ' + req.params.id)
            res.redirect('/buku')
        }
        else { // if MAHASISWA found

            res.render('buku/detail', {
                title: 'Edit buku',
                //data: rows[0],
                id: result[0]._id,
                judul: result[0].judul,
                penulis: result[0].penulis,
                tahun: result[0].tahun,
                genre: result[0].genre,
                harga: result[0].harga,
                stok: result[0].stok
            })
        }
    })

    
});

module.exports = app;