
import { Router } from 'express';
import { registration, login, getProfile } from '../controllers/users.js';
import authorize from '../middlewares/authorize.js';
import validation from '../middlewares/validation.js';
import schema from '../schemas/users.schema.js';

const router = Router();


router.post(
    '/registration',
    validation(schema.registration ),
    registration
);

router.post('/login', login);


router.get('/profile', authorize, getProfile);


router.get('/views/registration',(req, res)=>{
    res.render('registration');
} );
router.get('/views/login', (req, res)=>{
    res.render('login');
})
export default router;
