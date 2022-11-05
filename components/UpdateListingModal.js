import { Modal, Input, useNotification } from "web3uikit";
import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  onClose,
}) {
  const dispatch = useNotification();
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Listing updated - Please refresh (and move blocks)",
      title: "Listing Updated",
      position: "topR",
    });
    onClose();
    setPriceToUpdateListingWith(0);
  };

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onOk={() => {
        updateListing({
          onError: (err) => console.log(err),
          onSuccess: handleUpdateListingSuccess,
        });
      }}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
    >
      <div
        style={{
          padding: "20px 0",
        }}
      >
        <Input
          label="Update listing price in L1 Currency (ETH)"
          name="New listing price"
          type="number"
          onChange={(event) => {
            setPriceToUpdateListingWith(event.target.value);
          }}
        />
      </div>
    </Modal>
  );
}
