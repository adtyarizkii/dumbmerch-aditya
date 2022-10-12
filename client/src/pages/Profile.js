import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { Link } from 'react-router-dom'
import { Col, Row, Card, Button } from 'react-bootstrap'
import dateFormat from 'dateformat';
import { useQuery } from 'react-query';

import imgBlank from '../assets/blank-profile.png';

import { API } from '../config/api';


function Profile() {

    const title = 'Profile';
    document.title = 'DumbMerch | ' + title;
  
    const [state] = useContext(UserContext);
  
    let { data: profile } = useQuery('profileCache', async () => {
      const response = await API.get('/profile');
      return response.data.data;
    });
  
    let { data: transactions } = useQuery('transactionsCache', async () => {
      const response = await API.get('/transactions');
      return response.data.data;
    });

    return (
        <div className='user-container'>
            <div className='row'>
            <div className="pcard col-md-3">
                <p className='user-text'>My Profile</p>
                <img src={profile?.image ? profile.image : imgBlank} className="profile-pict" alt="..." />
            </div>
            <div className="cardtext col-md-5 pt-5 mb-3">
                <p className="card-title-text">Name</p>
                <p className="profile-card-text">{profile?.users?.name}</p>
                <p className="card-title-text mt-4">Email</p>
                <p className="profile-card-text">{state.user.email}</p>
                <p className="card-title-text mt-4">Phone</p>
                <p className="profile-card-text">{profile?.phone ? profile?.phone : '-'}</p>
                <p className="card-title-text mt-4">Gender</p>
                <p className="profile-card-text">{profile?.gender ? profile?.gender : '-'}</p>
                <p className="card-title-text mt-4">Address</p>
                <p className="profile-card-text">{profile?.address ? profile?.address : '-'}</p>
                <Button variant="success" as={Link} to='/user/profile/edit' className="btn-edit-profile">Edit Profile</Button>
            </div>
            <div className="col-md-4" style={{ padding: '0' }}>
                <p className='user-text'>My Transaction</p>
                {transactions?.map((item, index) => (
                    <Card className='mb-2 history-card' key={index}>
                        <Row>
                            <Col sm={3}>
                                <img src={item.products.image} alt="" className="img-history" />
                            </Col>
                            <Col sm={5}>
                                <p style={{color: '#F74D4D', fontWeight: '700'}}>{item.products.name}</p>
                                <p className='history-card-date'>{dateFormat(item.createdAt, 'dddd, d mmmm yyyy')}</p>
                                <p className='history-card-text'>Price: Rp. {item.price}</p>
                                <p className='history-card-text'><b>Sub Total: Rp. {item.price} </b></p>
                            </Col>
                            <Col sm={4}>
                            <div
                            className={`status-transaction-${item.status} rounded h-100 w-100 d-flex align-items-center justify-content-center`}
                          >
                            {item.status}
                          </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
            </div>
        </div>
    );
}

export default Profile;