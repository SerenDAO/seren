import { useState, useEffect } from "react"
import Image from 'next/image'
import UploadService from "../services/AvatarUploadService"
import FileInfo from "@/type/FileInfo"
import AvatarUploadProps from "../type/AvatarUploadProps"
import { Ed25519Keypair, Secp256k1Keypair, JsonRpcProvider, RawSigner, TypeTag, Network, getTransactionAuthorityQuorumSignInfo } from '@mysten/sui.js'
import { packageObjectId } from "../constants/constants"
import { getExecutionStatus, getTransactionDigest, getCreatedObjects } from "@mysten/sui.js"
import { provider } from "../constants/constants"
import assert from "assert"
import Avatar from "./Avatar"

const AvatarUpload = ({ component, setComponent, rawSigner, loginInfo, setLoginInfo }: AvatarUploadProps) => {
  const [currentFile, setCurrentFile] = useState<File>()
  const [progress, setProgress] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [fileInfos, setFileInfos] = useState<FileInfo>()

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    const selectedFiles = files as FileList
    setCurrentFile(selectedFiles?.[0])
    setProgress(0)
  }

  const upload = () => {
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
  }

  useEffect(() => {
    console.log(fileInfos)
  }, [fileInfos])

  useEffect(() => {
    console.log(loginInfo)
  }, [loginInfo])

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
        assert(createdObjects.length === 1, 'length of created "LoginInfo" objects has to be one')
        const loginInfo = createdObjects[0].reference.objectId
        setLoginInfo(loginInfo)
      }
      setComponent("UserHome")
    }

  }



  return (
    <div>
      <h3>Choose Your Avatar</h3>
      <div className="row">
        <div className="col-8">
          <label className="btn btn-default p-0">
            <input type="file" onChange={selectFile} />
          </label>
        </div>

        <div className="col-4">
          <button
            className="btn btn-success btn-sm"
            disabled={!currentFile}
            onClick={upload}
          >
            Upload
          </button>
        </div>
      </div>

      {currentFile && (
        <div className="progress my-3">
          <div
            className="progress-bar progress-bar-info"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: progress + "%" }}
          >
            {progress}%
          </div>
        </div>
      )}

      {message && (
        <div className="alert alert-secondary mt-3" role="alert">
          {message}
        </div>
      )}

      {fileInfos &&
        <>
          {// eslint-disable-next-line @next/next/no-img-element
            <Avatar
              url={"https://seren.infura-ipfs.io/ipfs/" + fileInfos.Hash}
            />
          }
          <ul className="list-group list-group-flush">
            <p>File name: {fileInfos.Name}</p>
            <p>File hash on IPFS: {fileInfos.Hash}</p>
            <p>File size: {fileInfos.Size}</p>
          </ul>
          {/* "rawSigner" has to exist here, because to reach this line, 
        "components" has to be set to "AvatarUpload" on the "CreateSuiAddress" page, 
        which means "displayKeys" is set to true, and "rawSigner" must have been created */}
          <button onClick={() => create_login_info(rawSigner!, "https://seren.infura-ipfs.io/ipfs/" + fileInfos.Hash)}>Create Account using Avatar</button>
        </>
      }

    </div>
  )
}

export default AvatarUpload