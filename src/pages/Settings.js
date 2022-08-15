import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useAuth } from "../auth";
import NavBar from "../components/NavBar";

const Settings = () => {
  const auth = useAuth();
  //current data fetch
  const [currentUserData, setCurrentUserData] = useState({});
  const [industriesList, setIndustriesList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  //for user data to post
  const [image, setImage] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState(industriesList[0]);
  const [selectedSkill, setSelectedSkill] = useState(skillsList[0]);
  const [skills, setSkills] = useState([]);
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCurrentUserData() {
      const response = await supabase
        .from("users")
        .select()
        .match({ id: auth.user.id });

      if (response) {
        setCurrentUserData(response.data[0]);
      }
    }

    async function fetchIndustriesList() {
      const response = await supabase.from("industry").select("name");

      if (response) {
        setIndustriesList(response.data.map((i) => i.name));
      }
    }

    async function fetchSkillsList() {
      const response = await supabase.from("skill").select("name");

      if (response) {
        setSkillsList(response.data.map((s) => s.name));
        //setSelectedSkill(skillsList[0]);
      }
    }

    fetchIndustriesList();
    fetchSkillsList();
    fetchCurrentUserData();
  }, []);

  const addSkill = () => {
    console.log("SKILLS LIST:", skillsList);
    console.log("SELECTED SKILL:", selectedSkill);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatarUrl = "";

    if (image) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${Date.now()}_${image.name}`, image);

      if (error) {
        console.log(error);
      }

      if (data) {
        setAvatarUrl(data.Key);
        avatarUrl = data.Key;
      }
    }

    // const { data, error } = await supabase.from("users").upsert({
    //   id: auth.user.id,
    //   name: name,
    //   website: website,
    //   industry: industry,
    //   avatar_url: avatarUrl,
    // });

    // if (error) {
    //   console.log(error);
    // }

    // if (data) {
    //   setMessage("Profile has been updated! :D");
    // }
  };

  return (
    <div>
      <NavBar />
      <h1>Settings</h1>
      {message && message}
      {/* <button onClick={consoleTest}>Console test</button> */}
      {/* <br /> */}
      {avatarUrl ? (
        <img
          src={`https://sphipqdbsrzdckcxbkgk.supabase.co/storage/v1/object/public/${avatarUrl}`}
          width={200}
          alt=""
        />
      ) : (
        "No avatar set."
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="avatar">Choose Avatar:</label>
          <input
            type="file"
            accept={"image/jpeg image/png"}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Display name:</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={currentUserData.name}
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry:</label>
          <select
            name="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {industriesList.map((option) =>
              currentUserData.industry === option ? (
                <option value={option} selected>
                  {option}
                </option>
              ) : (
                <option value={option}>{option}</option>
              )
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills:</label>
          <ul>
            {currentUserData.skills === undefined
              ? null
              : currentUserData.skills.map((s) => <li>{s}</li>)}
          </ul>
          <select
            name="skills"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option></option>
            {skillsList.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
          <button onClick={addSkill}>Add skill</button>
        </div>

        <div className="form-group">
          <label htmlFor="website">Website:</label>
          <input
            type="text"
            onChange={(e) => setWebsite(e.target.value)}
            value={currentUserData.website}
          />
        </div>

        <div className="form-group">
          <button type={"submit"}>Save profile!</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;