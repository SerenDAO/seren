import { useState, useEffect, useCallback } from "react"
import Image from 'next/image'
import UploadService from "../services/AvatarUploadService"
import FileInfo from "@/type/FileInfo"
import AvatarUploadProps from "../type/AvatarUploadProps"
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network, getTransactionAuthorityQuorumSignInfo } from '@mysten/sui.js'
import { packageObjectId } from "../constants/constants"
import { getExecutionStatus, getTransactionDigest, getCreatedObjects } from "@mysten/sui.js"
import { provider } from "../constants/constants"
import Avatar from "./Avatar"
import style from './styles/AvatarUpload.module.css'

const AvatarUpload = ({ component, setComponent, rawSigner, loginInfo, setLoginInfo }: AvatarUploadProps) => {
  const [currentFile, setCurrentFile] = useState<File>()
  const [progress, setProgress] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [fileInfos, setFileInfos] = useState<FileInfo>()
  const [name, setName] = useState<string>("")

  // get avatarUrl and name from localstorage when this component mounts
  useEffect(() => {
    if (!window.localStorage) return
    const avatarUrlFromStorage = window.localStorage.getItem("avatarUrl")
    const nameFromStorage = window.localStorage.getItem("name")
    if (avatarUrlFromStorage && nameFromStorage) {
      setComponent("UserHome")
    }
  }, [setComponent])


  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const selectedFiles = files as FileList
    setCurrentFile(selectedFiles?.[0])
  }

  const upload = useCallback(() => {
    setProgress(0)
    if (!currentFile) return

    UploadService.upload(currentFile, (event: any) => {
      setProgress(Math.round((100 * event.loaded) / event.total))
    })
      .then((response) => {
        setFileInfos(response.data)
      })
      .catch((err) => {
        setProgress(0)

        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message)
        } else {
          setMessage("Could not upload the File!")
        }

        setCurrentFile(undefined)
      })
  }, [currentFile])

  useEffect(() => {
    if (!currentFile) return
    upload()
  }, [currentFile, upload])

  const save = async () => {
    // save to browser localstorage
    const avatarUrl = "https://seren.infura-ipfs.io/ipfs/" + fileInfos?.Hash
    localStorage.setItem("avatarUrl", avatarUrl)
    localStorage.setItem("name", name)
    await create_login_info(rawSigner!, avatarUrl)


    const redirect = localStorage.getItem('redirect')
    if (redirect) {
      window.location.href = redirect
      // clear redirect
      localStorage.removeItem('redirect')
    }
  }

  const create_login_info = async (signer: RawSigner, avatarUrl: string) => {
    const moveCallTxn = await signer.executeMoveCall({
      packageObjectId,
      module: 'login_info',
      function: 'create_login_info',
      typeArguments: [],
      arguments: [
        avatarUrl
      ],
      gasBudget: 10000,
    })

    console.log("create login info transaction:")
    console.log(moveCallTxn)

    if (getExecutionStatus(moveCallTxn)?.status === "success") {
      // const txnDigest = getTransactionDigest(moveCallTxn);
      // console.log("txn digest:" + txnDigest);
      // get_login_info_event_data(provider, txnDigest);

      const createdObjects = getCreatedObjects(moveCallTxn)
      if (createdObjects !== undefined) {
        if (createdObjects.length !== 1) {
          alert('length of created "LoginInfo" objects has to be one')
          return
        }
        const loginInfo = createdObjects[0].reference.objectId
        setLoginInfo(loginInfo)
        localStorage.setItem("loginInfo", loginInfo)
      }
      setComponent("UserHome")
    }

  }

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }


  return (
    <div>
      <div className="row">
        <div className="col-8" style={{ textAlign: "center" }}>
          <div className={style.fileInput + " btn btn-default p-0"}>
            <span>Choose Your Avatar</span>
            <input type="file" onChange={selectFile} />

            {
              fileInfos && fileInfos?.Hash &&
              <Avatar
                className={style.avatar}
                url={"https://seren.infura-ipfs.io/ipfs/" + fileInfos.Hash}
              />
            }
          </div>
        </div>
        {currentFile && progress < 100 && (
          <div className="progress my-3">
            <div
              className="progress-bar progress-bar-info"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: "100%", textAlign: "center" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <div className="col-4">
          <input className={style.name} type="text" onChange={onNameChange} placeholder='Name' />
        </div>
      </div>


      {message && (
        <div className="alert alert-secondary mt-3" role="alert">
          {message}
        </div>
      )}

      {fileInfos && currentFile && progress >= 100 && name &&
        <>
          {/* "rawSigner" has to exist here, because to reach this line, 
        "components" has to be set to "AvatarUpload" on the "CreateSuiAddress" page, 
        which means "displayKeys" is set to true, and "rawSigner" must have been created */
            // Create Account using Avatar
          }
          <button className={style.save + ' btn'}
            onClick={save}>SAVE</button>
        </>
      }

    </div >
  )
}

export default AvatarUpload