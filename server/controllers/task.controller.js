import { Message, Project, Task } from "../models/project.models.js";
import User from "../models/user.models.js";

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;
    const newProject = new Project({
      name,
      createdBy: req.user.id,
    });
    console.log("current User", req.user);

    const savedProject = await newProject.save();
    console.log("Project : ", newProject);

    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const addMembers = async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log("projId", projectId);
    const { userName } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });

    }


    console.log(user);

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: user._id } },
      { new: true }
    ).populate('members','userName');
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await User.findByIdAndUpdate(
      user._id,
      { $push: { groups: projectId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: `User ${userName} added to the project`, project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const deleteProject = async (req, res) => {};

export const assignTask = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    console.log("projId", projectId);
    const { title, importance, assignedTo, dueDate } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = await User.findOne({ userName: assignedTo });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    
    }

    const task = new Task({
      title,
      importance,
      assignedTo: user._id,
      dueDate,
      project: projectId,
    });

    const savedTask = await task.save();

    const projDetails = await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    res.status(201).json({ Task: savedTask, ProjectDetails: projDetails });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const getAssignedTask = async (req, res) => {
try {
    const projectId = req.params.projectId;
    console.log("projectId",projectId);
    console.log("req.user.id",req.user.id);
    const assignedTask = await Task.find({ assignedTo: req.user.id, project: projectId });
    res.status(200).json({tasks:assignedTask});
} catch (error) {
  console.log(error.message);
  res.status(500).json({ error: error.message });
}
};
export const getLastSixTask = async (req, res) => {
  try {

    const userId = req.user.id; 
    console

    console.log(userId);

    const userProjects = await Project.find({ members: userId }).select("_id"); 
    console.log(userProjects);

    if (userProjects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this user" });
    }

    const tasks = await Task.find({ assignedTo: userId })
    .sort({ createdAt: -1 })
    .limit(6);
      console.log("Tasks",tasks);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error.message);
  }
};

export const getProjectsName = async (req, res) => {

  const userId = req.user.id;
  const projectsName = await User.find({ _id: userId }).populate('groups', 'name').select('groups')
  console.log("projectsName", projectsName);
  res.status(200).json({projNames:projectsName});
}

export const getMembers = async(req,res)=>{
try {
    const projid = req.params.projectId
  
    const findMembers = await Project.findById({_id:projid}).populate('members','userName')
    // console.log( findMembers.members.map(member=> member._id));
    
  
    console.log(findMembers);
    if(!findMembers){
        return res.status(404).json({message:"No project found with this id"})
    }
  
    res.status(201).json({members:findMembers.members})
} catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error.message);
  
}


}
export const sendMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    console.log("userName",req.user.userName);

    const newMessage = new Message({
      message,
      sender: req.user.userName,
      project: projectId,
    });

    await newMessage.save();

    res.status(201).json({message:newMessage});
  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log(err.message);
  }
};
export const getMessages = async (req, res) => {
  {
    try {
      const { projectId } = req.params;

      const messages = await Message.find({ project: projectId })
        .populate("sender", "userName fullName")
        .sort({ createdAt: 1 });

      res.status(200).json({messages:messages});
    } catch (err) {
      res.status(400).json({ error: err.message });
      console.log(err.message);
    }
  }
};
