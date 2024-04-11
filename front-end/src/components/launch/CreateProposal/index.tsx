"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/common/Button";
import { Input, InputNumber, Radio, DatePicker } from "antd";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import { enqueueSnackbar } from "notistack";

const CreateProposal = () => {
  const { setProposal } = useProposal();

  interface FormMessage {
    description: string;
    title: string;
    priceperNFT: number;
    funding_goal: number;
    proposal_type: string;
    date: any;
  }
  const initialValues: FormMessage = {
    title: "",
    description: "",
    priceperNFT: 1,
    funding_goal: 20,
    proposal_type: "",
    date: ``,
  };
  return (
    <div className="flex justify-center bg-gradient-to-t from-purple-900 via-purple-600 to-black animate-gradient">
      <div className="absolute" style={{ width: "180px", height: "180px", top: "150px", left: "1150px", gap: "0px", opacity: "0px", transform: "rotate(25.85deg)" }}>
          <img src="https://s3-alpha-sig.figma.com/img/6616/66fe/40bb3b9ecb0476f07d0d48f4eee8d284?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=GsQAuLyBZXPC~jFuB3-CbUO5lI1Pu58TL6DtDMeVJ9xBiCxCpXfwQFkKKNfWXPnncJrOj7elVnqa0vwUcWML9AJSuBJ6R8ETXRAeqptCIJ5ejC7Wa4O9hsrCp1rDuILJuz59WwQ~4tn95QsH23YDBCk1LBT0emMM~b-CKxrlFi~OyMBg-saCBy4xH-y~OzzyklHqOO~9caQwj9y2iZjDVCowOS8ZOxMMlfLc0PGOr93ObnshAshdVGPI6-s43qqqbtBo0Fx6KrX0c7FbgCiunRJ9rfzC~4A0r9~dUxVusuie2--G-bTQxTdr30NJYwcel-jvhtQKaCCvI~myyBRRUg__" alt="Your Image" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="absolute" style={{ width: "180px", height: "180px", top: "480px", left: "1150px", gap: "0px", opacity: "0px", transform: "rotate(25.85deg)" }}>
          <img src="https://s3-alpha-sig.figma.com/img/2e47/00f5/aa8e3df13e402ab6aa3e23e8a543ee63?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CSuPmtNYKR1OcTR91seaQ~q5OO0J8tjIaY0hoMfKqKgpmMrGu5j2M2gT8GD-w5Id2juNaIL0rt6J8R9SNUqAvawR5vbykD0DWmCDbTi0obVCP1EIVoKIoBOs9D5sa8GF-FXQ44PBnGyImwid2pOnUKRYDJBmLTsRq071F19X~fwaxCjVyb~Uf9k6Tbem-GmSAfn4mjN9GhN7XAccNo3wz6DQZYU8t3iXUuBjbxQBq2kW38kUMnE4FD4nZEUC9bZAB4DumJIcD5Fnja2BbSUW~Us1RBs-hZjKBhRHIhRD0TL9nWZr23LI2crmmXAx8vU7GK3KG~4p4T5M-QsQph9QhA__" alt="Your Image" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="absolute" style={{ width: "180px", height: "180px", top: "450px", left: "150px", gap: "0px", opacity: "0px", transform: "rotate(25.85deg)" }}>
          <img src="https://s3-alpha-sig.figma.com/img/772a/3dce/ef9cf4e677a337f8e9aa632f472e5287?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FV5IhBWdUWMYKc3im6nrjGnyWIrkfwLA98LZJWsQQcbynw305W20KINOtm05W5gNQFLN-fZaK17IR-qyGcBE2Vxdb3uLNJCzR1tQtWbaiCsP0-iZnWC7TKx0JxXYNxf0qr9C4MqIFjylE~gKDviYN6Vin3wLYGKlPJVWHYl4pMXav421RM-e9xTBVE-ZphxT0hVyTEN7YtEvJTo0N2LBuOk~5CoUwXwQ1Himl5i6eoSjggM6ogxOK4IfatXmLjXM0joCIjF3m2iLeQqbXfm9O83o1cM0~~xAvMKDuefayDJBzjZhHgWIyt1iaUscuylIYiJcB48pdIo01Js5Pg4gSw__" alt="Your Image" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="absolute" style={{ width: "180px", height: "180px", top: "150px", left: "150px", gap: "0px", opacity: "0px", transform: "rotate(25.85deg)" }}>
          <img src="https://s3-alpha-sig.figma.com/img/2e47/00f5/aa8e3df13e402ab6aa3e23e8a543ee63?Expires=1713139200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=CSuPmtNYKR1OcTR91seaQ~q5OO0J8tjIaY0hoMfKqKgpmMrGu5j2M2gT8GD-w5Id2juNaIL0rt6J8R9SNUqAvawR5vbykD0DWmCDbTi0obVCP1EIVoKIoBOs9D5sa8GF-FXQ44PBnGyImwid2pOnUKRYDJBmLTsRq071F19X~fwaxCjVyb~Uf9k6Tbem-GmSAfn4mjN9GhN7XAccNo3wz6DQZYU8t3iXUuBjbxQBq2kW38kUMnE4FD4nZEUC9bZAB4DumJIcD5Fnja2BbSUW~Us1RBs-hZjKBhRHIhRD0TL9nWZr23LI2crmmXAx8vU7GK3KG~4p4T5M-QsQph9QhA__" alt="Your Image" style={{ width: "100%", height: "100%" }} />
        </div>
        
      <div className="text-sm mt-8  py-8 px-8 max-w-lg rounded-md border mb-6 shadow border-gray-600 shadow-2xl bg-slate-950">
        <div className="flex justify-center">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              setProposal(values);
              enqueueSnackbar(`${values.title} has been created`, {
                variant: "success",
              });
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="text-white text-center text-2xl mb-1  font-semibold">
                  Submit Proposal
                </div>
                <div className="text-white text-center mb-6 bold italic">
                  Submit your project proposals and ideas for community votes
                  and crowdfunding
                </div>
                <div className="text-white flex flex-col gap-6">
                  {/* ------------------------  */}
                  <div>
                    <label className="font-medium" htmlFor="title">
                      Proposal Title
                    </label>
                    <div className="mt-2">
                      <Input
                        required
                        value={values.title}
                        onChange={(e: { target: { value: string } }) => {
                          setFieldValue("title", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* -------------  */}

                  {/* ------------------------  */}
                  <div>
                    <label className="font-medium" htmlFor="description">
                      Description
                    </label>
                    <div className=" mt-2">
                      <Input.TextArea
                        required
                        value={values.description}
                        onChange={(e: { target: { value: string } }) => {
                          setFieldValue("description", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* -------------  */}
                  <div className="flex items-center gap-8">
                    {/* ------------------------  */}
                    <div>
                      <label className="font-medium" htmlFor="priceperNFT">
                        Price per NFT
                      </label>
                      <div className="mt-2">
                        <InputNumber
                          required
                          value={values.priceperNFT}
                          onChange={(e) => {
                            setFieldValue("priceperNFT", e);
                          }}
                        />
                      </div>
                    </div>

                    {/* -------------  */}

                    {/* ------------------------  */}
                    <div>
                      <label className="text-white font-medium" htmlFor="funding_goal">
                        Funding Goal
                      </label>
                      <div className="mt-2">
                        <InputNumber
                          required
                          value={values.funding_goal}
                          onChange={(e) => {
                            setFieldValue("funding_goal", e);
                          }}
                        />
                      </div>
                    </div>

                    {/* -------------  */}
                  </div>
                  {/* ------------ */}
                  <Radio.Group
                    onChange={(e) => {
                      setFieldValue("proposal_type", e.target.value);
                    }}
                    value={values.proposal_type}
                  >
                    <Radio value={"collab"} className="!font-raleway text-white">
                      {" "}
                      DreamStarter Collab
                    </Radio>
                    <Radio value={"holder"} className="!font-raleway text-white">
                      {" "}
                      DreamStarter Holder
                    </Radio>
                  </Radio.Group>

                  {/* ----------  */}

                  {/* ----------------------  */}
                  <div>
                    <div>
                      <label htmlFor="date" className="block mb-2">
                        Valid till
                      </label>

                      <DatePicker
                        onChange={(e) => {
                          setFieldValue("date", e);
                        }}
                      />
                    </div>
                  </div>

                  {/* ---------------------- */}
                </div>

                <div className="flex justify-center mt-5">
                  <Button
                    className="flex justify-center"
                    variant="primary"
                    size="md"
                    type="submit"
                    _isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Create Proposal
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;
