import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getNotifications, markAsRead, markAllAsRead, clearAllNotifications } from '../services/notificationService';

const NotificationList = () => {
  const { data: notifications, refetch } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    refetch();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
      <div className="py-2">
        <div className="flex justify-between items-center px-4 py-2">
          <div className="font-bold text-lg">Notifications</div>
          <button
            onClick={async () => {
              await clearAllNotifications();
              refetch();
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            Clear All
          </button>
        </div>
        <hr />
        {notifications?.length > 0 ? (
          notifications.map((notification) => (
            <Link
              to={notification.link}
              key={notification._id}
              onClick={() => handleMarkAsRead(notification._id)}
              className={`block px-4 py-2 text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="font-bold">{notification.title}</div>
              <div>{notification.message}</div>
              <div className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
