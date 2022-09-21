import {props} from '../../App'
import Button from 'react-bootstrap/Button';

const Buttonp =(props)=> {
    return (
        <Button variant="dark">{props.children}</Button>
    )
}

export default Buttonp