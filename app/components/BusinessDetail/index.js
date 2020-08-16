import './index.scss'
import Link from 'next/link'
import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import GoogleMap from '../GoogleMap'
import { updateUserData } from '../../redux/user/action'
import ImageGallery from 'react-image-gallery'
import { useRouter } from 'next/router'

const Detail = ((props) => {
    const router = useRouter()

    const { business, user } = props
    const { token } = user
    const [isFaved, setIsFaved] = useState(false)
    const [galleryImages, setGalleryImages] = useState([])

    const favedImage = '/img/feastey_favoriteIcon_faved.png'
    const unfavedImage = '/img/feastey_favoriteIcon.png'

    useEffect(() => {

        let newGalleryImages = []
        business.images.forEach(element => {
            newGalleryImages.push({
                original: element.url,
                thumbnail: element.url,
                originalAlt: element.name,
                thumbnailAlt: element.name,
                originalTitle: element.name,
                thumbnailTitle: element.name
            })
        })

        setGalleryImages(newGalleryImages)

    }, [])

    useEffect(() => {
        favCheck();
    })

    const favCheck = () => {
        const favorites = user.favorites

        if (user.id) {
            const isFav = favorites.indexOf(business.id)
            if (isFav == -1) {
                setIsFaved(false)
            } else {
                setIsFaved(true)
            }
        }

    }

    const onToggleFav = () => {

        let favorites = props.user.favorites

        if (!props.user.id) {
            router.push("/login")
            console.log("Log in to add to favorites")
        } else {
            if (isFaved) {
                let index = favorites.indexOf(business.id)
                favorites.splice(index, 1)
                setIsFaved(false)
            } else {
                favorites.push(business.id)
                setIsFaved(true)
            }



            fetch(`${process.env.FEASTEY_API_URL}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ favorites })
            })
                .then(res => res.json())
                .then(res => {
                    if (!res.error) {
                        updateUserData({ favorites })
                    } else {
                        setIsFaved(!isFaved)
                    }
                })
        }
    }


    const renderAttachmentsList = () => {
        const { attachments } = business
        return attachments.map(attachment => {
            return <li>
                <h2>{attachment.name}</h2>
                <ul>{renderAttachmentFiles(attachment.files)}</ul>
            </li>
        })
    }

    const renderAttachmentFiles = (attachmentFiles) => {

        return attachmentFiles.map(file => {
            return <li className="file_Container">
                <a href={file.url} target="_blank">
                    <i class="fas fa-file"></i>
                    <h3>{file.name}</h3>
                </a>
            </li>
        })

    }

    const renderGalleryList = () => {
        const { images } = business
        return images.map(image => {
            return <li><div className="coverImage"><img title={image.name} alt={image.name} src={image.url}></img></div></li>
        })
    }

    const profileImage = business.mainImage ? business.mainImage : business.images[0] ? business.images[0] : { url: "/img/business-placeholder.jpeg", name: "placeholder" }


    return (
        <div className="BusinessDetail_MainContainer">
            <div className="col1">
                {(business.owner == user.id)
                    &&
                    <Link href={`/business/${business.id}/edit`}>
                        <a className="edit-button">Editar Pagina</a>
                    </Link>
                }
                <div className="title-container mobile">
                    <h2 className="title">{business.name}</h2>
                    <a className="location-icon" href="#map"><i class="fas fa-map-marker-alt" aria-hidden="true" /></a>
                </div>
                <p className="address mobile">{business.address}</p>
                <div className="coverImage">
                    <img src={profileImage.url} alt={profileImage.name} />
                </div>
                {business.info && <div className="contactInfo_Container">
                    {business.info.phone && <p><i class="fas fa-phone-alt" aria-hidden="true" /><a href={`tel:+${business.info.phone}`}>{business.info.phone}</a></p>}
                    {business.info.email && <p><i class="fas fa-envelope"></i>{business.info.email}</p>}
                    {business.info.twitter && <p><i class="fab fa-twitter"></i><a target="_blank" href={`https://www.twitter.com/${business.info.twitter}`}>{business.info.twitter}</a></p>}
                    {business.info.instagram && <p><i class="fab fa-instagram-square"></i><a target="_blank" href={`https://www.instagram.com/${business.info.instagram}`}>{business.info.instagram}</a></p>}
                    {business.info.facebook && <p><i class="fab fa-facebook"></i><a target="_blank" href={`https://www.facebook.com/${business.info.facebook}`}>{business.info.facebook}</a></p>}
                </div>}
            </div>
            <div className="col2">
                <div className="titleAndFavSection_Container">
                    <h2 className="title">{business.name}</h2>
                    <a className="location-icon" href="#map"><i class="fas fa-map-marker-alt" aria-hidden="true" /></a>
                    <div className="titleIcons">
                        {/* <p>200</p>
                        <img className="BusinessDetailLikeIcon" src={'/img/feastey_likeIcon.png'} /> */}

                        <img onClick={(e) => onToggleFav()} className="BusinessDetailFavIcon" src={isFaved ? favedImage : unfavedImage} alt="favorite button" />
                    </div>
                </div>
                <p className="address">{business.address}</p>

                <div className="description" dangerouslySetInnerHTML={{ __html: business.description }} />

                <ul className="section_Container">
                    {renderAttachmentsList()}
                </ul>
                <div className="gallery_Container">
                    {galleryImages.length > 0 && <ImageGallery items={galleryImages} showPlayButton={false} />}
                </div>
                <div id="map" className="map-container">
                    <div className="directions">
                        <a className="directions-link">Como llegar</a>
                    </div>
                    <GoogleMap class="map" lng={business.location.coordinates[0]} lat={business.location.coordinates[1]} />
                </div>
            </div>
        </div>
    )
})

const mapDispatchToProps = (dispatch) => {
    return { updateUserData: (data) => { dispatch(updateUserData({ ...data })) } }
}
export default connect((state => state), mapDispatchToProps)(Detail)
