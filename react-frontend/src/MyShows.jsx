import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import axios from 'axios'

import useLoginToken from './useLoginToken';

import MediaDisplay from './MediaDisplay';
import EditMedia from './EditMedia';
import "./MyShows.css"


function MyShows() {

  const navigate = useNavigate();
  const { getLoginToken } = useLoginToken();

  const [mediaList, setMediaList] = useState([]);
  const [index, setIndex] = useState({start: 0, end: 3});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [savedMedia, setSavedMedia] = useState({});
  // const [saveMediaToBackend, setSaveMediaToBackend] = useState({});

  const [sortingSelection, setSortingSelection] = useState("");
  const typesOfSorts = ["A-Z", "Z-A", "Streaming Service"];

  async function fetchMedia(id, mediaMetaData) {
    try {
      const response = await axios.get(`http://localhost:7777/media/${id}`);
      return {
                ...response.data.media_list,
                currentHours: mediaMetaData.currentHours,
                currentMinutes: mediaMetaData.currentMinutes,
                currentSeason: mediaMetaData.currentSeason,
                currentEpisode: mediaMetaData.currentEpisode,
            };
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  // Run on page load
  useEffect(() => {
    const loginToken = getLoginToken();
    if (loginToken === null) navigate('/');

    axios.get(`http://localhost:7777/users/${loginToken}`)
      .then(response => {
        const userMedias = response.data.users_list.mediaList;
        return Promise.all(userMedias.map(mediaValue => fetchMedia(mediaValue.mediaId, mediaValue)));
      })
      .then(responseArray => {
        setMediaList(responseArray);
      })
      .catch(error => console.log(error.response));
    // setMediaList([]);
  }, [])

  function getSortedMediaList() {
    const temp = [...mediaList];
    temp.sort((a,b) => {
        let fa;
        let fb;
        switch (sortingSelection) {
            case "A-Z":
                fa = a.name.toLowerCase();
                fb = b.name.toLowerCase();
                break;
            case "Z-A":
                fa = b.name.toLowerCase();
                fb = a.name.toLowerCase();
                break;
            case "Streaming Service":
                fa = a.streamingService.toLowerCase();
                fb = b.streamingService.toLowerCase();
                break;
            default: break;
        }
        if (fa < fb) return -1;
        if (fa > fb) return  1;
        return 0;
    })
    // console.debug(temp)
    return temp;
  }

  function moveMediaListLeft(){
    if (index.start - 1 < 0) return
    setIndex({start: index.start - 1, end: index.end - 1});
  }

  function moveMediaListRight(){
    if (index.end + 1 > mediaList.length) return;
    setIndex({start: index.start + 1, end: index.end + 1});
  }

  function conditionalButton(){
    if (sortingSelection !== ""){
      return (
        <form className="my-shows-sorting">
            {typesOfSorts.map(val =>
                <div key={val}>
                  <input
                  type="radio"
                  checked={ val === sortingSelection }
                  onChange={() => setSortingSelection(val)}
                  className="my-shows-radio-button"
                  />
                  {val}
                </div>
            )}
          <button type="button" onClick={() => setSortingSelection("")} className="my-shows-close-button">close</button>
        </form>
      );
    }
    return <button type="button" onClick={() => setSortingSelection(typesOfSorts[0])} className="my-shows-sort-button">SORT</button>
  }

  async function saveMediaDetails(media) {
    const loginToken = getLoginToken();
    const newMedia = {
            mediaList: [
            {
                mediaId: media.id,
                currentEpisode: media.currentEpisode,
                currentSeason: media.currentSeason,
                currentMinutes: media.currentMinutes,
                currentHours: media.currentHours
            }]};
    try {
        await axios.patch(`http://localhost:7777/users/${loginToken}`, newMedia);
        return true;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  const closeModalAndSave = (media) => {
    setIsOpen(false);
    saveMediaDetails(media);
    const arr = [];
    mediaList.forEach(m => {
        if (m._id === media.id){
            const c = {
                _id: media.id,
                ...media
            }
            delete c.id;
            arr.push(c);
        }
        else{
            arr.push(m);
        }
    });
    setMediaList(arr);
  }

  const customStyles = {
      content: {
        width: "50%",
        height: "70%",
        transform: 'translate(40%, 0)',
        backgroundColor: '#A13237',
      },
    }

    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement('#root');

  return (
    <div className="my-shows-parent">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)} 
        style={customStyles}
      >
        <EditMedia
            /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
            id={savedMedia._id}
            name={savedMedia.name}
            img={savedMedia.img}
            desc={savedMedia.desc}
            streamingService={savedMedia.streamingService}
            contentType={savedMedia.contentType}
            currentSeason={savedMedia.currentSeason}
            currentEpisode={savedMedia.currentEpisode}
            currentHours={savedMedia.currentHours}
            currentMinutes={savedMedia.currentMinutes}
            closeModalAndSave={closeModalAndSave}
        />
      </Modal>

      <div className="my-shows-header-parent">
        <div className="my-shows-box-office-parent">
        <button className="my-shows-button" type="button" onClick={() => navigate("/")}><span className="my-shows-box">Box</span>Office</button>
        </div>
        <div className="my-shows-search-parent">
          <input type="search" className="my-shows-searchbar" placeholder="Filter"/>
        </div>
      </div>
      <div className="my-shows-text">My Shows</div>
      { mediaList.length === 0 
       ? <div className="my-shows-no-media">No Media To Display!</div>
       : <div>
            <div className="my-shows-media-holder">
                <button type="button" onClick={moveMediaListLeft} className="my-shows-move-left-button">&lt;</button>
                    {getSortedMediaList().slice(index.start, index.end).map(media => 
                      <MediaDisplay key={media.name} media={media} setSavedMedia={setSavedMedia} setIsOpen={setIsOpen}/>
                    )}
                <button type="button" onClick={moveMediaListRight} className="my-shows-move-right-button">&gt;</button>
            </div>
            {conditionalButton()}
        </div>
      }
    </div>
  );
}

export default MyShows;
