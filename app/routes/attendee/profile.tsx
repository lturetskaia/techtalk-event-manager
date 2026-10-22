import type { Route } from './+types/profile';
import { Card, ListGroup } from 'react-bootstrap';
import { get } from './../../utils/http';
import { useState } from 'react';
import type { UserDetails } from '~/utils/types';
import UserDetailsForm from '../components/userDetailsForm';
import { Alert } from 'react-bootstrap';
import { post } from '~/utils/http';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'TechTalk | My Profile' },
    { name: 'Profile details', content: '' },
  ];
}
export async function clientLoader() {
  const profileData = await get('/attendee/profile');
  return profileData;
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const [userData, setUserData] = useState<UserDetails>(loaderData);
  const [updatingMessage, setUpdatingMessage] = useState({
    active: false,
    message: '',
    isError: false,
  });

  async function handleFormSubmission(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const userData: UserDetails = {
      first_name: data.first_name.toString() || '',
      last_name: data.last_name.toString() || '',
      email: data.email.toString() || '',
      phone: data.phone.toString() || '',
    };

    try {
      const response = await post(`/attendee/profile`, userData);
      //show success message
      setUpdatingMessage({
        active: true,
        message:
          response.message || 'You have successfully updated the profile!',
        isError: false,
      });
      setUserData(userData);
      event.target.reset();
    } catch (err: any) {
      //show success message
      setUpdatingMessage({
        active: true,
        message:
          err.message ||
          'An error occurred while updating the profile. Check the entered details and try again.',
        isError: true,
      });
    } finally {
      setTimeout(() => {
        setUpdatingMessage({
          active: false,
          message: '',
          isError: false,
        });
      }, 5000);
    }
  }

  return (
    <main>
      <h2>Contact details</h2>
      <Card>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <div className="description">
              <b>First name:</b>
            </div>
            <div className="info">{userData.first_name}</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="description">
              <b>Last name:</b>
            </div>
            <div className="info">{userData.last_name}</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="description">
              <b>Email:</b>
            </div>
            <div className="info">{userData.email}</div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="description">
              <b>Phone:</b>
            </div>
            <div className="info">{userData.phone}</div>
          </ListGroup.Item>
        </ListGroup>
      </Card>

      <h2>Edit</h2>
      <UserDetailsForm
        user={userData}
        handleFormSubmission={handleFormSubmission}
      />
      {updatingMessage.active ? (
        <Alert variant={updatingMessage.isError ? 'danger' : 'success'}>
          {updatingMessage.message}
        </Alert>
      ) : null}
    </main>
  );
}
