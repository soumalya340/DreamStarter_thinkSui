"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ConvertModal from "../ConvertModal";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";

const ProposalSummary = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { proposal } = useProposal();
  if (!proposal)
    return (
      <div className="flex flex-col gap-4 justify-center items-center mt-20">
        <Lottie animationData={notFound} loop={true} />
        <div className="text-lg">No ongoing proposal</div>
      </div>
    );
  return (
    <>
      <div className="flex justify-center bg-gradient-to-t from-purple-900 via-purple-600 to-black animate-gradient p-40">
        <div className="text-sm mt-8  py-8 px-8 max-w-lg rounded-md border mb-6 shadow border-gray-600 shadow-2xl bg-slate-950">
          <div className="text-lg font-medium mb-4 text-white">
            {/* Lorem ipsum dolor sit amet  */}
            {proposal?.title}
          </div>
          <div className="mb-2 text-white">
            {/* Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. */}
            {proposal?.description}
          </div>
          <div className="text-white">
            ✅ <strong>55%</strong> of voters love your proposal
          </div>
          <div className="flex justify-center mt-5">
            <Button
              className="flex justify-center"
              variant="primary"
              size="md"
              type="button"
              onClick={() => {
                setOpen(true);
              }}
            >
              Launch
            </Button>
          </div>
        </div>
        {/* -----------------  */}
        <Modal
          open={open}
          width={600}
          onCancel={() => setOpen(false)}
          closable={true}
          centered
        >
          <ConvertModal />
        </Modal>
      </div>
    </>
  );
};

export default ProposalSummary;
