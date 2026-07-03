"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const websites = [
  "LinkedIn",
  "Indeed",
  "Naukri",
  "Wellfound",
  "Greenhouse",
  "Company Careers",
];

export default function PreferencesPage() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");

  const [experience, setExperience] = useState("Fresher");

  const [workMode, setWorkMode] = useState("Any");

  const [selectedSites, setSelectedSites] = useState<string[]>([
    "LinkedIn",
  ]);

  function toggleSite(site: string) {
    if (selectedSites.includes(site)) {
      setSelectedSites(selectedSites.filter((s) => s !== site));
    } else {
      setSelectedSites([...selectedSites, site]);
    }
  }

  function continueSearch() {
    if (!location || !department || selectedSites.length === 0) {
      alert("Please fill all required fields.");
      return;
    }

    localStorage.setItem(
      "job_preferences",
      JSON.stringify({
        location,
        department,
        experience,
        work_mode: workMode,
        sites: selectedSites,
      })
    );

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#05060a] text-white flex justify-center items-center p-10">

      <div className="w-full max-w-3xl rounded-2xl bg-[#0a0b10] border border-white/10 p-8">

        <h1 className="text-3xl font-bold">
          Job Preferences
        </h1>

        <p className="text-white/60 mt-2 mb-8">
          Help the AI find better jobs for you.
        </p>

        <div className="space-y-6">

          <div>
            <label className="block mb-2">
              Preferred Location *
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Bangalore"
              className="w-full rounded-xl bg-black/30 border border-white/10 p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Department *
            </label>

            <input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="DevOps Engineer"
              className="w-full rounded-xl bg-black/30 border border-white/10 p-3"
            />
          </div>

          <div>
            <label className="block mb-2">
              Experience
            </label>

            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 p-3"
            >
              <option>Fresher</option>
              <option>0-1 Years</option>
              <option>1-3 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">
              Work Mode
            </label>

            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full rounded-xl bg-black/30 border border-white/10 p-3"
            >
              <option>Any</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>
          </div>

          <div>

            <label className="block mb-3">
              Job Websites *
            </label>

            <div className="grid grid-cols-2 gap-3">

              {websites.map((site) => (
                <button
                  key={site}
                  type="button"
                  onClick={() => toggleSite(site)}
                  className={`rounded-xl border p-3 transition ${
                    selectedSites.includes(site)
                      ? "bg-cyan-500 text-black border-cyan-500"
                      : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  {site}
                </button>
              ))}

            </div>

          </div>

          <button
            onClick={continueSearch}
            className="w-full rounded-xl bg-cyan-500 py-4 text-black font-semibold text-lg"
          >
            Continue
          </button>

        </div>

      </div>

    </div>
  );
}
