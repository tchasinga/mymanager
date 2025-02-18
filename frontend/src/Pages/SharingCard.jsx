import { Link } from "react-router-dom";

export default function SharingCard({ sharinglist }) {
  return (
    <div className="flex flex-col justify-center items-center maxWidth bg-gray-100 rounded-lg p-3">
      <Link to={`/sharingdeteals/${sharinglist._id}`}>
        <div className="flex flex-col justify-between relative items-center">
          <img src={sharinglist.sharinglist.imageUrls} className="h-[250px] w-full relative object-cover rounded-2xl" alt={sharinglist.title} />
          <div className="absolute text-white font-semibold bottom-0 right-0 left-0 px-5 text-sm bg-slate-300 p-2">
            <h1>{sharinglist.sharinglist.title}</h1>
          </div>
        </div>
      </Link>
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center px-3">
          <p className="text-slate-950 text-sm font-normal line-clamp-3">{sharinglist.sharinglist.description}</p>
        </div>
      </div>
    </div>
  );
}

