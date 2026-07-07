import "./Settings.css";
import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile
} from "../../api/settingApi";

function Settings() {

    const [formData, setFormData] = useState({

        name: "",

        email: ""

    });

    async function fetchProfile() {

        try {

            const response = await getProfile();

            setFormData({

                name: response.data.name,

                email: response.data.email

            });

        }

        catch (error) {

            alert(error.response?.data?.message || error.message);

        }

    }

    useEffect(() => {
         const loadProfile = async () => {
            await fetchProfile();
        }           

         loadProfile();
    }, []);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await updateProfile(formData);

            alert("Profile Updated Successfully");

        }

        catch (error) {

            alert(error.response?.data?.message || error.message);

        }

    }

    return (

        <div className="settings">

            <h1>Settings</h1>

            <form onSubmit={handleSubmit}>

                <label>Name</label>

                <input

                    type="text"

                    value={formData.name}

                    onChange={(e) =>

                        setFormData({

                            ...formData,

                            name: e.target.value

                        })

                    }

                />

                <label>Email</label>

                <input

                    type="email"

                    value={formData.email}

                    onChange={(e) =>

                        setFormData({

                            ...formData,

                            email: e.target.value

                        })

                    }

                />

                <button type="submit">

                    Save Changes

                </button>

            </form>

        </div>

    );

}

export default Settings;