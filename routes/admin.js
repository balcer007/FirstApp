const express = require('express');
const News = require('../models/news');
const { NotExtended } = require('http-errors');

const router = express.Router();

router.all('*', (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('login');
    return;  // to jest wazne (bo bledy ze wzgledu na next)
  } 
  next();
});

/* GET home page. */
router.get('/', (req, res) => {

  News.find({}, (err, data) => {
    res.render('admin/index', { title: 'Admin', data })
  });
});

router.get('/news/add', (req, res) => {
  res.render('admin/news-form', { title: 'Dodaj news', body: {}, errors: {} });  
});

router.post('/news/add', (req, res) => {

  const body = req.body;
  const newsData = new News(body);
  
  const errors = newsData.validateSync();

  if (!errors) {
    newsData.save((err) => {

    if (err) {
      res.render('admin/news-form', { title: 'Dodaj news', body, errors });  
      return;
    } 

    res.redirect('/admin');

  })
} else res.render('admin/news-form', { title: 'Dodaj news', body, errors });  

});

router.get('/news/delete/:id', (req,res) => {
  News.findByIdAndDelete(req.params.id, (err)=> {
    res.redirect('/admin');
  });
  //res.render('admin/news-form', { title: 'Dodaj news', body, errors });  
});

module.exports = router;