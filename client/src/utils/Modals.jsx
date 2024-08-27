import React, { useEffect, useState } from "react";
import { ConfigProvider, Modal } from "antd";
import axios from "axios";
import {Link} from "react-router-dom";
export const Modals = ({ open, setOpen ,  }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/project/getProjectsName",
          { withCredentials: true }
        );
        setProjects(res.data.projNames);
        console.log("res.data.projNames",res.data.projNames);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      }
    };

    getProjects();
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            contentBg: "#006A4E",
          },
        },
      }}
    >
      <Modal
        footer={null}
        open={open}
        onCancel={() => setOpen(false)}
        width={500}
        centered={true}
      >
        <div className="h-40 flex flex-col justify-center items-center hover:cursor-pointer gap-1 text-white">
          <h1 className="text-3xl p-2">Your Projects</h1>
          {projects.map((project) =>
            project.groups.map((group) => (
              <h1 key={group._id} className="text-xl hover:text-gray-500">
               
                <Link to={`/Project/${group._id}`}> {group.name}</Link>
               
              </h1>
            ))
          )}
        </div>
      </Modal>
    </ConfigProvider>
  );
};
