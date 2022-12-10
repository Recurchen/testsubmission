import { useState } from 'react';

export default function useUserId() {
    const getUserId = () => {
        const idString = sessionStorage.getItem('id');
        const userId = JSON.parse(idString);
        return  userId;
      };
    const [userId, setUserId] = useState(getUserId());

    const saveUserId = userId => {
        sessionStorage.setItem('id', JSON.stringify(userId));
        setUserId(userId);
      };

    return {
        setUserId: saveUserId,
        userId
    }
}