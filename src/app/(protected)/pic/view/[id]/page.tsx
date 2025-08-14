"use client";
import { Button } from "@/components/ui/button";
import {  useUser } from "@/contexts/UserContext";


import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { time } from "console";

import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { CheckIcon, XIcon } from "lucide-react";






export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [editedData, setEditedData] = useState<any>({});
  const [newComment, setNewComment] = useState<string>("");

    const { userData } = useUser();

  // const comments = [
  //     { id: 1, text: "This is a comment", author: "User1", date: "2023-10-01", time: "10:00 AM", email: "x@ratpdev.com" , status: "Pending" },
  //     { id: 2, text: "This is another comment", author: "User2", date: "2023-10-02", time: "11:00 AM", email: "x2@ratpdev.com" , status: "Approved"},
  //     { id: 3, text: "Yet another comment", author: "User3", date: "2023-10-03", time: "12:00 PM", email: "x3@ratpdev.com" , status: "Rejected"},
  //     // Add more comments as needed

  // ]

  const approvalFunction = async (actionId: string, commentID: string, status: string ) => {

    // console.log("urlId is: ", urlId);
    const response = await fetch(`https://n8n.srv869586.hstgr.cloud/webhook/pic-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalId: params.id }),
    });
    if (response.ok) {
      // const d = await response.json();
      // console.log("Approval response: ", d);
   router.push(`/view/${params.id}`);
    //  alert(JSON.stringify(d, null, 2));
    } else {
      console.error("Failed to approve action");
      const errorData = await response.json();
      console.error("Error details:", errorData);
    }
  };

  const getActions = async () => {
    const response = await fetch(`/api/pic/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: params.id }),
    });

    if (response.ok) {
      const d = await response.json();
      setActions(d); // Assuming the response is an array of actions
      console.log("actions is: ", d);

      // setResult(JSON.stringify(d, null, 2));
    }
  };

  useEffect(() => {
    // const getActions = async () => {
    //   const response = await fetch(`/api/pic/actions`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ id: params.id }),
    //   });

    //   if (response.ok) {
    //     const d = await response.json();
    //     setActions(d); // Assuming the response is an array of actions
    //     console.log("actions is: ", d);
    //   }
    // };

    const handler = async () => {
      const res = await fetch(`https://n8n.srv869586.hstgr.cloud/webhook/pic-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personalId: params.id }),
    });
      const data = await res.json();

      console.log("Fetched data:", data);
      setData(data[0]);
      // setActions(data.actions || []); // Initialize actions with fetched data
      setEditedData(data[0]); // Initialize editedData with fetched data
      console.log("yfyuvh",data);
    };
    handler();
    getActions();
  }, [params.id]);

  const handleChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addNewComment = async (commentD: string) => {
    const uid = localStorage.getItem("uid");

    const userData: any = await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: uid }),
    });

    const newUserData = await userData.json();

    if (!newComment.trim()) return; // Prevent adding empty comments

    const newAction = {
      // id: actions.length + 1, // Simple ID generation
      comment: commentD,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      dateTime: new Date().toISOString(), // ISO format for consistency
      email: `${newUserData.user.customClaims.businessEmail}`, // Placeholder email, replace with actual user email if available
      status: "Pending", // Default status for new comments
      commentID: Math.random().toString(36).substring(2, 15), // Generate a random comment ID
      id: params.id, // Assuming you want to link the comment to the current PIC record
    };

    console.log("New action to be added:", newAction);
    // alert("New comment added: " + JSON.stringify(newAction));

    const response = await fetch(`/api/pic/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAction),
    });

    if (response.ok) {
      const d = await response.json();
      console.log(d);
      getActions();
      setNewComment(""); // Clear the input after adding the comment

      const mailResponse = await fetch(`/api/picsendemail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newComment,
          requester: newUserData.user.customClaims.businessEmail,
          requestId: params.id,
        }),
      });

      if (mailResponse.ok) {
        const successSending = await response.json();
        console.log("Email sent successfully:", successSending);
      }
    }
  };
  //localhost:3001/api/picsendemail

  // setResult(JSON.stringify(d, null, 2));

  // addNewComment

  // const updateList = async () => {
  //     const res = await fetch(`/api/pic/${params.id}`, {
  //         method: "PUT",
  //         headers: {
  //             "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(editedData),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  // };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h3 className="font-bold flex flex-col ">
        <span>GL3 | PIC List | Edit</span>
      </h3>

      <Card className="mt-4 bg-transparent border-2 bg-white text-black border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <CardHeader className="bg-slate-600 text-white">
          <CardTitle>PIC Details</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <p>
            <strong>ID:</strong> {data?.id}
          </p>
          <div className="flex justify-center items-center gap-2 my-4">
            <Label className="whitespace-nowrap">Username:</Label>
            <Input
              type="text"
              disabled={true}
              value={editedData?.name || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              className="border p-1 rounded"
            />
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <Label className="whitespace-nowrap">Company:</Label>
            <Input
              type="text"
              disabled={true}
              value={editedData?.company || ""}
              onChange={(e) => handleChange("company", e.target.value)}
              className="border p-1 rounded"
            />
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <Label className="whitespace-nowrap">Phone:</Label>
            <Input
              type="text"
              disabled={true}
              value={editedData?.phoneNumber || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="border p-1 rounded"
            />
          </div>
          <div className="flex justify-start items-center gap-2 my-4">
            <Label className="whitespace-nowrap">Status:</Label>
            <div className="border flex-1 w-full p-1 rounded bg-white text-black">
              <Select
                value={editedData?.status || ""}
                defaultValue={editedData?.state}
                disabled={true}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Blacklisted">Blacklisted</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <Label className="whitespace-nowrap">End Date:</Label>
            <Input
              type="text"
              disabled={true}
              value={editedData?.accreditationEndDate || ""}
              onChange={(e) => handleChange("enddate", e.target.value)}
              className="border p-1 rounded"
            />
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <Label className="whitespace-nowrap">Last Date:</Label>
            <Input
              type="text"
              disabled={true}
              value={editedData?.accreditationEndDate || ""}
              onChange={(e) => handleChange("lastDate", e.target.value)}
              className="border p-1 rounded"
            />
          </div>

          <p>
            <strong>PIC Serial:</strong> {editedData?.PICSerial || ""}
          </p>

          <Card className="my-8">
            <CardHeader>
              <CardTitle>PIC History:</CardTitle>
              <CardDescription> </CardDescription>
              {/* <CardAction>Card Action</CardAction> */}
            </CardHeader>
            <CardContent>
              {/* <p>{newComment}</p> */}
              <div className="flex w-full items-center gap-2 my-5">
                <Input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="New comment"
                />
                <Button
                  onClick={() => addNewComment(newComment)}
                  variant="outline"
                >
                  Add
                </Button>
              </div>

             

              {actions.map((action: any, i: any) => (
                <div key={i} className="mb-2 p-2 border rounded bg-gray-50">
                  <div className="w-full justify-between flex-row flex">
                    {" "}
                    <p className="font-semibold">
                      {" "}
                      {action.date} - {action.time} - {action.email}
                    </p>{" "}
                    <p>
                      {action.status === "Pending" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Pending</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-32 p-2 border bg-background shadow-sm m-2"
                            align="start"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                approvalFunction(action.id, action.commentID, "Approved")
                              }
                              className="flex flex-row items-center cursor-pointer"
                            >
                              <div className="h-3 text-teal-500">
                                <CheckIcon height={16} />{" "}
                              </div>{" "}
                              <span>Approve</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem  onClick={() =>
                                approvalFunction(action.id, action.commentID, "Rejected")
                              } className="flex flex-row items-center">
                              <div className="h-3 text-red-500">
                                {" "}
                                <XIcon height={16} />{" "}
                              </div>{" "}
                              <span>Reject</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="outline"
                          className=""
                          onClick={() =>
                            router.push(
                              `/view/${params.id}/request/${action.urlId}`
                            )
                          }
                        >
                          {action.status}
                        </Button>
                      )}
                    </p>
                  </div>

                  <p>
                    <span className="text-black/50">Comment: </span>{" "}
                    {action.comment}

                     {/* {JSON.stringify(data)} */}
                     {/* ------ */}
                     {/* {JSON.stringify(action)} */}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* <p>
                            <strong>PIC Serial:</strong>{" "}
                            <Input
                                type="text"
                                value={editedData?.PICSerial || ""}
                                onChange={(e) => handleChange("PICSerial", e.target.value)}
                                className="border p-1 rounded"
                            />
                        </p> */}
        </CardContent>

        <CardFooter>
          {/* <Button className="w-full max-w-xl mx-auto" onClick={()=> updateList()}>Update</Button> */}
        </CardFooter>
      </Card>

      {/* <pre className="mt-4 p-2 bg-gray-100 border rounded">
                    {JSON.stringify(editedData, null, 2)}
                </pre> */}
    </div>
  );
}

