import { Notification } from "../model/notificationModel.js";

export const getNotifications = async (req, res) => {
  try {
      if(!req.user || !req.user._id){
          return res.status(401).json({message: 'User not authenticated.'});
      }

      if(req.user.role === 'Manager'){
          const notifications = await Notification.find({userId:req.user._id}).sort({createdAt: -1});
          return res.status(200).json(notifications);
      }

      if(req.user.role === 'Employee'){
          const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
          return res.status(200).json(notifications);
      }

      return res.status(403).json({message:'Access denied. Invalid user role.'});

  } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({message:'Server error.',error: error.message});
  }
};
export const markAsRead = async (req, res) => {
  const {notificationId} = req.params;

  try {
      if(!req.user || !req.user._id){
          return res.status(401).json({message:'User not authenticated.'});
      }

      if(req.user.role === 'Employee'){
          const notification = await Notification.findOne({_id:notificationId,userId:req.user._id});

          if(!notification){
              return res.status(404).json({message:'Notification not found or not accessible by this user.'});
          }

          notification.read = true;
          await notification.save();

          return res.status(200).json({message:'Notification marked as read.'});
      }else if(req.user.role === 'Manager'){
          const notification = await Notification.findById(notificationId);

          if(!notification){
              return res.status(404).json({message:'Notification not found.'});
          }

          notification.read = true;
          await notification.save();

          await Notification.updateMany(
              { role: 'Manager', read: true },
              { read: true }
          );

          return res.status(200).json({message:'Notification marked as read for the manager.'});
      } else {
          return res.status(403).json({message:'Access denied. Invalid user role.'});
      }
  } catch (error) {
      console.error("Error marking notification as read:", error);
      return res.status(500).json({message:'Server error.',error: error.message});
  }
};
