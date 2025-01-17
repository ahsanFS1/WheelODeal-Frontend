import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "./ui/button";
import { Settings, Eye, LogOut, Save, Calendar } from "lucide-react";
import { SpinningWheel } from "./SpinningWheel";
import { TextInput } from "./admin/shared/TextInput";
import { ImageUpload } from "./admin/shared/ImageUpload";
import { Carousel } from "./carousel/Carousel";
import { Toaster, toast } from "sonner";
import { AnalyticsDashboard } from "./analytics/AnalyticsDashboard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { api_Url, web_Url } from "../config";
import { useParams } from "react-router-dom"; // Import for accessing route parameters
import { VideoEditor } from "./admin/editors/VideoEditor";
import { Select, SelectItem } from "./ui/select"; // Example dropdown component
import { ColorPicker } from "./admin/shared/ColorPicker";
import TiptapEditor from "./admin/shared/TiptapEditor";
import { Helmet } from "react-helmet-async";
import { AccessibilityMenu } from "./AccessibilityMenu";

export const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  interface PublicPage {
    publicPageId: string;
    publicPageName: string;
    [key: string]: any; // Include other properties if applicable
  }

  const [publicPages, setPublicPages] = useState<PublicPage[]>([]);

  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [remainingPages, setRemainingPages] = useState(0);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false); // State to control the confirmation dialog
  const [newPageName, setNewPageName] = useState("");
  const [showPreview, setShowPreview] = useState(null);
  useEffect(() => {
    const fetchPublicPages = async () => {
      try {
        setIsFetching(true);
        const [pagesResponse, planResponse] = await Promise.all([
          fetch(`${api_Url}/api/public-page/${projectId}`),
          fetch(`${api_Url}/api/admin/SPkeys/${projectId}`),
        ]);

        const pagesData = await pagesResponse.json();
        const planData = await planResponse.json();

        if (pagesData.success) {
          setPublicPages(pagesData.data);
          setSelectedPage(pagesData.data[0] || null);
        }

        if (planData.success) {
          setPlanDetails(planData.data[0]);
          setRemainingPages(planData.data[0].remainingPages);
        }

        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data.");
        setIsFetching(false);
      }
    };

    if (projectId) fetchPublicPages();
  }, [projectId]);
  const handlePageSelection = (pageId: string) => {
    const selected = publicPages.find((page) => page.publicPageId === pageId);
    if (selected) {
      setSelectedPage(selected);
    } else {
      console.error("Page not found for the given ID:", pageId);
      setSelectedPage(null); // Set to null if no matching page is found
    }
  };

  const handleCreatePage = async () => {
    if (remainingPages <= 0 || !newPageName.trim()) {
      toast.error(
        "Cannot create a page. Please check remaining pages and enter a name."
      );
      return;
    }

    try {
      const response = await fetch(`${api_Url}/api/public-page/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, publicPageName: newPageName }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Public page created successfully!");
        setPublicPages([...publicPages, data.data]);
        setRemainingPages(remainingPages - 1);
        setSelectedPage(data.data);
        setNewPageName("");
        window.location.reload();
      } else {
        toast.error("Failed to create a public page.");
      }
    } catch (error) {
      console.error("Error creating a public page:", error);
      toast.error("Error creating a public page.");
    }
  };
  const handleSave = async () => {
    if (!selectedPage) {
      toast.error("No public page selected to save changes.");
      return;
    }

    // Optimistically update the publicPages state
    setPublicPages((prev) =>
      prev.map((page) =>
        page.publicPageId === selectedPage.publicPageId
          ? { ...page, ...selectedPage }
          : page
      )
    );
    toast("Saving changes...", { icon: "⏳" });

    try {
      const response = await fetch(
        `${api_Url}/api/public-page/${selectedPage.publicPageId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedPage),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Changes saved successfully!");
      } else {
        throw new Error(data.message || "Save failed");
      }
    } catch (error) {
      console.error("Error saving public page:", error);
      toast.error("Failed to save changes.");
    }
  };
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  if (!publicPages.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-purple-200 space-y-4 bg-[#121218]">
        <h1 className="text-2xl font-semibold">
          Welcome To Your Projects - You have 0/{planDetails?.remainingPages}{" "}
          projects created - Create your first project!
        </h1>
        <div className="space-y-4">
          <TextInput
            label="Enter a Name for Your First Page"
            value={newPageName}
            onChange={(value) => setNewPageName(value)}
          />
          <Button
            onClick={handleCreatePage}
            disabled={!newPageName.trim()}
            className={`px-4 py-2 rounded-lg ${
              newPageName.trim()
                ? "bg-purple-700 text-white hover:bg-purple-900"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Your First Public Page
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(planDetails?.expiryDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleDeletePage = async () => {
    if (!selectedPage.publicPageId) return;

    try {
      const response = await fetch(
        `${api_Url}/api/public-page/${selectedPage.publicPageId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the deleted page from the state
        setPublicPages(
          publicPages.filter(
            (page) => page.publicPageId !== selectedPage.publicPageId
          )
        );
        setSelectedPage({ publicPageId: "", publicPageName: "" }); // Clear selected page
        window.location.reload();
      } else {
        alert("Failed to delete page");
      }
    } catch (error) {
      alert("Error deleting page");
    }
  };
  console.log(selectedPage.mobileBackgroundImage);
  return (
    <>
      <Helmet prioritizeSeoTags>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta httpEquiv="X-Robots-Tag" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-[#121218] overflow-x-hidden">
        <AccessibilityMenu />
        <Toaster position="top-center" />
        <header className="bg-[#1B1B21] shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-[#D3D3DF] flex items-center gap-2">
              <Settings className="w-8 h-8 text-white" />
              Project Configuration
            </h1>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-purple-600  text-sm rounded-lg hover:bg-zinc-800 hover:text-white transition-all duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 px-3 py-2 bg-[#1B1B21] text-[#C33AFF] border border-#aba5ae text-sm rounded-lg hover:bg-zinc-900/5 hover:text-white transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 mb-6">
            <div className="bg-[#1B1B21] rounded-lg shadow-md p-6 text-white space-y-4">
              <h2 className="text-2xl font-bold text-white">Plan Details</h2>
              <div className="space-y-2">
                <p className="text-lg font-bold">
                  <span className="font-bold text-[#aba5ae]">Plan:</span>{" "}
                  {planDetails?.plan
                    ? planDetails.plan.charAt(0).toUpperCase() +
                      planDetails.plan.slice(1)
                    : "N/A"}
                </p>
                <p className="text-lg font-bold">
                  <span className="font-semibold text-[#aba5ae]">
                    Remaining Pages:
                  </span>{" "}
                  {remainingPages}
                </p>
                <p className="text-lg">
                  <span className="font-semibold text-[#aba5ae]">
                    Public Page Link:
                  </span>{" "}
                  {selectedPage ? (
                    <a
                      href={`${web_Url}/wheel/${selectedPage.publicPageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white underline hover:text-gray-600"
                    >
                      {web_Url}/wheel/{selectedPage.publicPageId}
                    </a>
                  ) : (
                    "No page selected"
                  )}
                </p>

                <p className="text-lg font-bold">
                  <span className="font-semibold text-[#aba5ae]">
                    Your plan expires on: &nbsp;
                  </span>
                  {formattedDate}
                </p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-[#D3D3DF]">Projects:</h2>
            <Select
              value={selectedPage?.publicPageId || ""}
              onChange={(e) => handlePageSelection(e.target.value)}
              className="bg-[#1B1B21] text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {publicPages.map((page) => (
                <SelectItem key={page.publicPageName} value={page.publicPageId}>
                  {page.publicPageName}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="space-y-4">
            <TextInput
              label="New Page Name"
              value={newPageName}
              onChange={(value) => setNewPageName(value)}
            />
            <Button
              onClick={handleCreatePage}
              className={`px-4 py-2 rounded-lg ${
                remainingPages > 0
                  ? "px-4 py-2 rounded bg-neutral-900 text-purple-800 hover:bg-neutral-800 border border-[#C33AFF]"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }`}
              disabled={remainingPages <= 0}
            >
              Create New Public Page
            </Button>
          </div>
          <br></br>
          <h2 className="text-xl font-semibold text-[#D3D3DF]">
            Rename Project
          </h2>
          <div className="space-y-4">
            <TextInput
              label=""
              value={selectedPage.publicPageName || ""}
              onChange={(value) =>
                setSelectedPage({
                  ...selectedPage,
                  publicPageName: value, // Directly assign the string value
                })
              }
            />
            <button
              onClick={() => setIsConfirmingDelete(true)}
              className="bg-red-600 text-white hover:bg-red-500 text-sm py-1 px-2 rounded"
            >
              Delete Page
            </button>

            {isConfirmingDelete && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-10">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                  <h3 className="text-xl font-semibold mb-4">
                    Are you sure you want to delete this page? All the Data from
                    this Page will be lost!
                  </h3>
                  <Button
                    onClick={handleDeletePage}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                  >
                    Yes, Delete
                  </Button>
                  <Button
                    onClick={() => setIsConfirmingDelete(false)} // Close the dialog without deleting
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 ml-4"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Tabs.Root defaultValue="general" className="space-y-8 py-6">
            {/* Horizontal Scrolling Tabs */}
            <Tabs.List className="flex overflow-x-auto space-x-4 pb-4 border-b border-[#C33AFF]/20 scrollbar-thin scrollbar-thumb-[#C33AFF]/20 whitespace-nowrap">
              <Tabs.Trigger
                value="general"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                General Settings
              </Tabs.Trigger>
              <Tabs.Trigger
                value="carousel"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Carousel
              </Tabs.Trigger>
              <Tabs.Trigger
                value="video"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Video Settings
              </Tabs.Trigger>
              <Tabs.Trigger
                value="wheel"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Wheel Settings
              </Tabs.Trigger>
              <Tabs.Trigger
                value="preview"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Preview
              </Tabs.Trigger>
              <Tabs.Trigger
                value="footer"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Footer
              </Tabs.Trigger>
              <Tabs.Trigger
                value="final-cta"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Final CTA
              </Tabs.Trigger>
              <Tabs.Trigger
                value="analytics"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Analytics
              </Tabs.Trigger>
              <Tabs.Trigger
                value="tracking"
                className="px-4 py-2 text-[#D3D3DF] hover:text-[#C33AFF] data-[state=active]:text-[#C33AFF] data-[state=active]:border-b-2 data-[state=active]:border-[#C33AFF] transition-colors"
              >
                Tracking
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="general" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[#D3D3DF]">
                      Page Settings
                    </h2>
                    <div className="flex items-center space-x-4 mb-6">
                      <label className="text-sm font-medium text-[#D3D3DF]">
                        Accessibility Settings
                      </label>
                      <input
                        type="checkbox"
                        checked={selectedPage.accessibilityOn ?? true} // Default to true
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            accessibilityOn: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>
                    <TiptapEditor
                      content={selectedPage.headerTitle || ""}
                      onContentChange={(content) =>
                        setSelectedPage({
                          ...selectedPage,
                          headerTitle: content,
                        })
                      }
                    />
                    <TiptapEditor
                      content={selectedPage.subtitle || ""}
                      onContentChange={(content) =>
                        setSelectedPage({ ...selectedPage, subtitle: content })
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUpload
                        label="Logo"
                        type="publicpage"
                        currentImage={selectedPage.logo}
                        onUpload={(url) =>
                          setSelectedPage({ ...selectedPage, logo: url })
                        }
                        recommendations={{
                          maxSize: 1,
                          dimensions: "200x200px",
                          format: "PNG, SVG preferred",
                        }}
                      />
                      <ImageUpload
                        label="Background Image"
                        type="publicpage"
                        currentImage={selectedPage.backgroundImage}
                        onUpload={(url) =>
                          setSelectedPage({
                            ...selectedPage,
                            backgroundImage: url,
                          })
                        }
                        recommendations={{
                          maxSize: 1,
                          dimensions: "1920x1080px",
                          format: "JPG, PNG",
                        }}
                      />
                      <ImageUpload
                        label="Mobile Background Image"
                        type="publicpage"
                        currentImage={selectedPage.mobileBackgroundImage}
                        onUpload={(url) =>
                          setSelectedPage({
                            ...selectedPage,
                            mobileBackgroundImage: url,
                          })
                        }
                        recommendations={{
                          maxSize: 1,
                          dimensions: "1080x1920px", // Mobile resolution recommendations
                          format: "JPG, PNG",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">
                      Preview
                    </h2>
                    <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                      <a
                        href={`https://www.wheelodeal.com/wheel/${selectedPage?.publicPageId}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="relative aspect-video overflow-hidden rounded-lg"
                        style={{
                          backgroundImage: `url(${selectedPage.backgroundImage})`,
                        }}
                      >
                        <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full text-center">
                          <img
                            src={selectedPage.logo}
                            alt="Logo"
                            className="h-20 mb-6 object-contain"
                          />
                          <h1
                            className="text-4xl font-bold text-white mb-4"
                            dangerouslySetInnerHTML={{
                              __html:
                                selectedPage.headerTitle ||
                                "Your Amazing Header",
                            }}
                          />
                          <p
                            className="text-xl text-white/80"
                            dangerouslySetInnerHTML={{
                              __html:
                                selectedPage.subtitle ||
                                "Your Subheadline Goes Here",
                            }}
                          />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="carousel" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[#D3D3DF]">
                      Carousel Images
                    </h2>
                    <ImageUpload
                      label="Add Image (Max 6)"
                      type="carousel"
                      currentImage=""
                      onUpload={(url, alt) => {
                        if (!url) {
                          toast.error("Invalid image URL.");
                          return;
                        }
                        if (selectedPage.carouselImages.length >= 6) {
                          toast.error("Maximum 6 images allowed");
                          return;
                        }
                        setSelectedPage({
                          ...selectedPage,
                          carouselImages: [
                            ...selectedPage.carouselImages,
                            { url, alt },
                          ], // Update carousel images
                        });
                      }}
                      recommendations={{
                        maxSize: 1,
                        dimensions: "1200x800px",
                        format: "JPG, PNG",
                      }}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPage &&
                      selectedPage.carouselImages &&
                      selectedPage?.carouselImages?.length > 0 ? (
                        selectedPage.carouselImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image.url}
                              alt={`Carousel ${index + 1}`}
                              className="w-full aspect-video object-cover rounded-lg"
                            />
                            <button
                              onClick={() =>
                                setSelectedPage((prev) => {
                                  const updatedImages =
                                    prev.carouselImages.filter(
                                      (_, i) => i !== index
                                    );
                                  console.log("Updated Images:", updatedImages); // Debugging
                                  return {
                                    ...prev,
                                    carouselImages: updatedImages,
                                  };
                                })
                              }
                              className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-sm rounded-lg shadow-lg opacity-90"
                              title="Remove"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No images available</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-6 text-[#D3D3DF]">
                      Preview
                    </h2>
                    <div className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4">
                      {selectedPage.carouselImages &&
                      selectedPage.carouselImages.length > 0 ? (
                        <Carousel images={selectedPage?.carouselImages || []} />
                      ) : (
                        <p className="text-[#D3D3DF] text-center">
                          No images to display in preview.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="video" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-[#D3D3DF]">
                  Video Settings
                </h2>
                <VideoEditor
                  videoId={selectedPage.videoId || ""}
                  onChange={(videoId) =>
                    setSelectedPage({ ...selectedPage, videoId })
                  }
                />
              </div>
            </Tabs.Content>

            <Tabs.Content value="wheel" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Wheel Settings */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[#D3D3DF]">
                      Wheel Settings
                    </h2>
                    <div>
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-[#D3D3DF]">
                          Enable Auto Renewal of Expiration Date
                        </label>
                        <input
                          type="checkbox"
                          checked={selectedPage.automateExpiry || false}
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              automateExpiry: e.target.checked, // Directly update the boolean value
                            })
                          }
                          className="w-5 h-5"
                        />
                      </div>

                      {/* Disclaimer Text */}
                      <p className="text-xs text-[#A6A6A6] mt-2">
                        By enabling this option, AutoRenewal will occur every 2
                        hours, checking and renewing the expiration date for 2 hours of all
                        expired prizes automatically. This ensures that all
                        prizes will remain active, and no prize will expire
                        without renewal.
                      </p>
                    </div>

                    {selectedPage.prizes.map((prize, index) => (
                      <div
                        key={index}
                        className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4 relative"
                      >
                        {/* Remove Prize Button */}
                        <button
                          onClick={() =>
                            setSelectedPage({
                              ...selectedPage,
                              prizes: selectedPage.prizes.filter(
                                (_, i) => i !== index
                              ),
                            })
                          }
                          className="absolute top-2 right-2 bg-[#FF4D4D] text-white px-2 py-1 rounded-full hover:bg-[#FF3333] transition"
                          title="Remove Prize"
                        >
                          ✕
                        </button>

                        {/* Prize Text */}
                        <TextInput
                          label="Prize Text"
                          value={prize.text || ""}
                          onChange={(value) =>
                            setSelectedPage({
                              ...selectedPage,
                              prizes: selectedPage.prizes.map((p, i) =>
                                i === index ? { ...p, text: value } : p
                              ),
                            })
                          }
                        />

                        {/* Bonus Code */}
                        <TextInput
                          label="Bonus Code"
                          value={prize.bonusCode || ""}
                          onChange={(value) =>
                            setSelectedPage({
                              ...selectedPage,
                              prizes: selectedPage.prizes.map((p, i) =>
                                i === index ? { ...p, bonusCode: value } : p
                              ),
                            })
                          }
                        />

                        {/* Expiration Date */}

                        <div>
                          <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                            Expiration Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]} // Set today's date as the minimum
                            value={
                              prize.expirationDate
                                ? new Date(prize.expirationDate)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const selectedDate = e.target.value; // Raw value in YYYY-MM-DD format
                              const today = new Date()
                                .toISOString()
                                .split("T")[0]; // Today's date in YYYY-MM-DD format

                              if (selectedDate < today) {
                                // Set the error message in the state
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? {
                                          ...p,
                                          error:
                                            "Expiration date cannot be in the past.",
                                        }
                                      : p
                                  ),
                                });
                              } else {
                                // Clear the error message and update the date
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? {
                                          ...p,
                                          expirationDate: selectedDate,
                                          error: "",
                                        }
                                      : p
                                  ),
                                });
                              }
                            }}
                            className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
                          />
                          {/* Display error message */}
                          {prize.error && (
                            <p className="text-sm text-red-500 mt-1">
                              {prize.error}
                            </p>
                          )}
                        </div>

                        {/* Redirect URL */}
                        <TextInput
                          label="Redirect URL"
                          value={prize.redirectUrl || ""}
                          onChange={(value) =>
                            setSelectedPage({
                              ...selectedPage,
                              prizes: selectedPage.prizes.map((p, i) =>
                                i === index ? { ...p, redirectUrl: value } : p
                              ),
                            })
                          }
                        />

                        {/* Gradient Toggle */}
                        <div className="flex items-center space-x-4">
                          <label className="text-sm font-medium text-[#D3D3DF]">
                            Enable Gradient
                          </label>
                          <input
                            type="checkbox"
                            checked={prize.gradient || false}
                            onChange={(e) =>
                              setSelectedPage({
                                ...selectedPage,
                                prizes: selectedPage.prizes.map((p, i) =>
                                  i === index
                                    ? { ...p, gradient: e.target.checked }
                                    : p
                                ),
                              })
                            }
                            className="w-5 h-5"
                          />
                        </div>

                        {/* Gradient Colors and Direction */}
                        {prize.gradient && (
                          <>
                            <ColorPicker
                              label="Gradient Start Color"
                              value={prize.gradientStart || "#6C63FF"}
                              onChange={(value) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? { ...p, gradientStart: value }
                                      : p
                                  ),
                                })
                              }
                            />
                            <ColorPicker
                              label="Gradient End Color"
                              value={prize.gradientEnd || "#4B4AC9"}
                              onChange={(value) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? { ...p, gradientEnd: value }
                                      : p
                                  ),
                                })
                              }
                            />
                            <Select
                              label="Gradient Direction"
                              value={prize.gradientDirection || "to bottom"}
                              onChange={(e) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? {
                                          ...p,
                                          gradientDirection: e.target.value,
                                        }
                                      : p
                                  ),
                                })
                              }
                              className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
                            >
                              <SelectItem value="to top">To Top</SelectItem>
                              <SelectItem value="to bottom">
                                To Bottom
                              </SelectItem>
                              <SelectItem value="to left">To Left</SelectItem>
                              <SelectItem value="to right">To Right</SelectItem>
                              <SelectItem value="to top left">
                                To Top Left
                              </SelectItem>
                              <SelectItem value="to top right">
                                To Top Right
                              </SelectItem>
                              <SelectItem value="to bottom left">
                                To Bottom Left
                              </SelectItem>
                              <SelectItem value="to bottom right">
                                To Bottom Right
                              </SelectItem>
                            </Select>
                          </>
                        )}

                        {/* Color and Probability */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                              Color
                            </label>
                            <input
                              type="color"
                              value={prize.color}
                              onChange={(e) =>
                                setSelectedPage({
                                  ...selectedPage,
                                  prizes: selectedPage.prizes.map((p, i) =>
                                    i === index
                                      ? { ...p, color: e.target.value }
                                      : p
                                  ),
                                })
                              }
                              className="w-full h-10 px-1 py-1 bg-[#121218] border border-[#C33AFF]/20 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#D3D3DF] mb-1">
                              Probability (0-1)
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="1"
                              step="0.1"
                              value={prize.probability}
                              onChange={(e) => {
                                const inputValue = parseFloat(e.target.value);

                                if (
                                  !isNaN(inputValue) &&
                                  inputValue >= 0 &&
                                  inputValue <= 1
                                ) {
                                  // Valid input: Update probability
                                  setSelectedPage({
                                    ...selectedPage,
                                    prizes: selectedPage.prizes.map((p, i) =>
                                      i === index
                                        ? { ...p, probability: inputValue }
                                        : p
                                    ),
                                  });
                                  e.target.setCustomValidity(""); // Clear error message
                                } else {
                                  // Invalid input: Set error message
                                  e.target.setCustomValidity(
                                    "Probability must be between 0 and 1."
                                  );
                                  e.target.reportValidity(); // Trigger browser to show the message
                                }
                              }}
                              className="w-full px-3 py-2 bg-[#121218] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Toggle for Winning Music */}
                    <div className="flex items-center space-x-4 mb-6">
                      <label className="text-sm font-medium text-[#D3D3DF]">
                        Enable Winning Music
                      </label>
                      <input
                        type="checkbox"
                        checked={selectedPage.musicEnabled ?? true} // Default to true
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            musicEnabled: e.target.checked,
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    <h2 className="text-xl font-semibold text-[#D3D3DF]">
                      Wheel Button Settings
                    </h2>

                    {/* Button Text */}
                    <TextInput
                      label="Button Text"
                      value={selectedPage.wheelButton?.text || "SPIN"}
                      onChange={(value) =>
                        setSelectedPage({
                          ...selectedPage,
                          wheelButton: {
                            ...selectedPage.wheelButton,
                            text: value,
                          },
                        })
                      }
                    />

                    {/* Text Color */}
                    <ColorPicker
                      label="Text Color"
                      value={selectedPage.wheelButton?.textColor || "#FFFFFF"}
                      onChange={(value) =>
                        setSelectedPage({
                          ...selectedPage,
                          wheelButton: {
                            ...selectedPage.wheelButton,
                            textColor: value,
                          },
                        })
                      }
                    />

                    {/* Background Color */}
                    <ColorPicker
                      label="Background Color"
                      value={
                        selectedPage.wheelButton?.backgroundColor || "#8B5CF6"
                      }
                      onChange={(value) =>
                        setSelectedPage({
                          ...selectedPage,
                          wheelButton: {
                            ...selectedPage.wheelButton,
                            backgroundColor: value,
                          },
                        })
                      }
                    />

                    {/* Gradient Toggle */}
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-medium text-[#D3D3DF]">
                        Enable Gradient
                      </label>
                      <input
                        type="checkbox"
                        checked={selectedPage.wheelButton?.gradient || false}
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            wheelButton: {
                              ...selectedPage.wheelButton,
                              gradient: e.target.checked,
                            },
                          })
                        }
                        className="w-5 h-5"
                      />
                    </div>

                    {/* Gradient Colors and Direction */}
                    {selectedPage.wheelButton?.gradient && (
                      <>
                        <ColorPicker
                          label="Gradient Start Color"
                          value={
                            selectedPage.wheelButton?.gradientStart || "#6C63FF"
                          }
                          onChange={(value) =>
                            setSelectedPage({
                              ...selectedPage,
                              wheelButton: {
                                ...selectedPage.wheelButton,
                                gradientStart: value,
                              },
                            })
                          }
                        />
                        <ColorPicker
                          label="Gradient End Color"
                          value={
                            selectedPage.wheelButton?.gradientEnd || "#4B4AC9"
                          }
                          onChange={(value) =>
                            setSelectedPage({
                              ...selectedPage,
                              wheelButton: {
                                ...selectedPage.wheelButton,
                                gradientEnd: value,
                              },
                            })
                          }
                        />
                        <Select
                          label="Gradient Direction"
                          value={
                            selectedPage.wheelButton?.gradientDirection ||
                            "to bottom"
                          }
                          onChange={(e) =>
                            setSelectedPage({
                              ...selectedPage,
                              wheelButton: {
                                ...selectedPage.wheelButton,
                                gradientDirection: e.target.value,
                              },
                            })
                          }
                          className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
                        >
                          <SelectItem value="to top">To Top</SelectItem>
                          <SelectItem value="to bottom">To Bottom</SelectItem>
                          <SelectItem value="to left">To Left</SelectItem>
                          <SelectItem value="to right">To Right</SelectItem>
                          <SelectItem value="to top left">
                            To Top Left
                          </SelectItem>
                          <SelectItem value="to top right">
                            To Top Right
                          </SelectItem>
                          <SelectItem value="to bottom left">
                            To Bottom Left
                          </SelectItem>
                          <SelectItem value="to bottom right">
                            To Bottom Right
                          </SelectItem>
                        </Select>
                      </>
                    )}

                    {/* Add Prize Button */}
                    <Button
                      onClick={() =>
                        setSelectedPage({
                          ...selectedPage,
                          prizes: [
                            ...selectedPage.prizes,
                            {
                              text: "",
                              gradient: false,
                              gradientStart: "#6C63FF",
                              gradientEnd: "#4B4AC9",
                              gradientDirection: "to right",
                              color: "#ffffff",
                              probability: 0,
                              redirectUrl: "",
                              glowColor: "#FFFFFF",
                              expirationDate: new Date(),
                              bonusCode: "",
                            },
                          ],
                        })
                      }
                      className="bg-purple-900 hover:bg-purple-950 text-white w-full"
                    >
                      Add Prize
                    </Button>
                  </div>

                  {/* Wheel Preview */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-[#D3D3DF]">
                        Preview
                      </h2>
                      <Button
                        onClick={() => setShowPreview(!showPreview)}
                        variant="outline"
                        className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                        {showPreview ? "Hide Preview" : "Show Preview"}
                      </Button>
                    </div>
                    {showPreview && (
                      <div className="relative">
                        <SpinningWheel
                          prizes={selectedPage.prizes}
                          onSpinEnd={() => {}}
                          disabled={false}
                          button={selectedPage.wheelButton}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="preview" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">
                    Preview
                  </h2>
                  <Button
                    onClick={() => setShowPreview(!showPreview)} // Toggle preview visibility
                    variant="outline"
                    className="flex items-center gap-2 bg-[#1B1B21] border-[#C33AFF] text-[#C33AFF] hover:bg-[#C33AFF] hover:text-white"
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </div>
                {showPreview && (
                  <div className="relative">
                    <iframe
                      src={`${web_Url}/wheel/${selectedPage.publicPageId}`}
                      className="w-full h-[800px] rounded-lg border border-[#C33AFF]/20"
                      title="Page Preview"
                      sandbox="allow-scripts allow-same-origin"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </Tabs.Content>
            <Tabs.Content value="footer" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#D3D3DF]">
                    Footer Content
                  </h2>

                  {/* HTML/Markdown Editor */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Footer Text
                    </label>
                    <TiptapEditor
                      content={selectedPage.footer || ""}
                      onContentChange={(content) =>
                        setSelectedPage({ ...selectedPage, footer: content })
                      }
                    />

                    <TextInput
                      label="Lower Footer"
                      value={selectedPage.lowerFooter || ""}
                      onChange={(value) =>
                        setSelectedPage({ ...selectedPage, lowerFooter: value })
                      }
                    />
                    <strong>
                      <span className="text-white">(HTML Allowed)</span>
                    </strong>
                  </div>

                  {/* Preview Section */}
                  <div
                    className="mt-4 p-4 border border-[#C33AFF]/20 bg-[#121218] rounded-lg text-[#C33AFF]"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedPage.footer ||
                        "<p>Preview will appear here...</p>",
                    }}
                  />
                  <div
                    className="mt-4 p-4 border border-[#C33AFF]/20 bg-[#121218] rounded-lg text-[#C33AFF]"
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedPage.lowerFooter ||
                        "<p>Preview will appear here...</p>",
                    }}
                  />
                </div>
              </div>
            </Tabs.Content>
            <Tabs.Content value="final-cta" className="space-y-8">
              <div className="bg-[#1B1B21] p-6 text-white rounded-lg shadow-lg space-y-6 max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-[#D3D3DF]">
                  Final CTA Settings
                </h2>

                {/* Button Text */}
                <TextInput
                  label="Button Text"
                  value={selectedPage.finalCta?.text || ""}
                  onChange={(value) =>
                    setSelectedPage({
                      ...selectedPage,
                      finalCta: { ...selectedPage.finalCta, text: value },
                    })
                  }
                />

                {/* Button Size */}
                <Select
                  value={selectedPage.finalCta?.size || "medium"}
                  onChange={(e) =>
                    setSelectedPage({
                      ...selectedPage,
                      finalCta: {
                        ...selectedPage.finalCta,
                        size: e.target.value,
                      },
                    })
                  }
                  className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
                >
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </Select>

                {/* Text Color */}
                <ColorPicker
                  label="Text Color"
                  value={selectedPage.finalCta?.textColor || "#ffffff"}
                  onChange={(value) =>
                    setSelectedPage({
                      ...selectedPage,
                      finalCta: { ...selectedPage.finalCta, textColor: value },
                    })
                  }
                />

                {/* Background Color */}
                <ColorPicker
                  label="Background Color"
                  value={selectedPage.finalCta?.backgroundColor || "#4CAF50"}
                  onChange={(value) =>
                    setSelectedPage({
                      ...selectedPage,
                      finalCta: {
                        ...selectedPage.finalCta,
                        backgroundColor: value,
                      },
                    })
                  }
                />

                {/* Hover Color */}
                <ColorPicker
                  label="Hover Color"
                  value={selectedPage.finalCta?.hoverColor || "#45a049"}
                  onChange={(value) =>
                    setSelectedPage({
                      ...selectedPage,
                      finalCta: { ...selectedPage.finalCta, hoverColor: value },
                    })
                  }
                />

                {/* Gradient Toggle */}
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-[#D3D3DF]">
                    Enable Gradient
                  </label>
                  <input
                    type="checkbox"
                    checked={selectedPage.finalCta?.gradient || false}
                    onChange={(e) =>
                      setSelectedPage({
                        ...selectedPage,
                        finalCta: {
                          ...selectedPage.finalCta,
                          gradient: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>

                {/* Gradient Colors */}
                {selectedPage.finalCta?.gradient && (
                  <>
                    <ColorPicker
                      label="Gradient Start Color"
                      value={selectedPage.finalCta?.gradientStart || "#6C63FF"}
                      onChange={(value) =>
                        setSelectedPage({
                          ...selectedPage,
                          finalCta: {
                            ...selectedPage.finalCta,
                            gradientStart: value,
                          },
                        })
                      }
                    />
                    <ColorPicker
                      label="Gradient End Color"
                      value={selectedPage.finalCta?.gradientEnd || "#4B4AC9"}
                      onChange={(value) =>
                        setSelectedPage({
                          ...selectedPage,
                          finalCta: {
                            ...selectedPage.finalCta,
                            gradientEnd: value,
                          },
                        })
                      }
                    />
                    <Select
                      label="Gradient Direction"
                      value={
                        selectedPage.finalCta?.gradientDirection || "to bottom"
                      }
                      onChange={(e) =>
                        setSelectedPage({
                          ...selectedPage,
                          finalCta: {
                            ...selectedPage.finalCta,
                            gradientDirection: e.target.value,
                          },
                        })
                      }
                      className="bg-[#1B1B21] text-[#C33AFF] px-4 py-2 rounded-lg"
                    >
                      <SelectItem value="to top">To Top</SelectItem>
                      <SelectItem value="to bottom">To Bottom</SelectItem>
                      <SelectItem value="to left">To Left</SelectItem>
                      <SelectItem value="to right">To Right</SelectItem>
                      <SelectItem value="to top left">To Top Left</SelectItem>
                      <SelectItem value="to top right">To Top Right</SelectItem>
                      <SelectItem value="to bottom left">
                        To Bottom Left
                      </SelectItem>
                      <SelectItem value="to bottom right">
                        To Bottom Right
                      </SelectItem>
                    </Select>
                  </>
                )}

                {/* Preview */}
                <div className="pt-6">
                  <h3 className="text-lg font-semibold text-[#D3D3DF] text-center">
                    Preview
                  </h3>
                  <div className="flex justify-center mt-4">
                    <a
                      href={selectedPage.finalCta?.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg transition-all duration-200"
                      style={{
                        padding:
                          selectedPage.finalCta?.size === "small"
                            ? "8px 16px"
                            : selectedPage.finalCta?.size === "large"
                            ? "14px 28px"
                            : "10px 20px",
                        fontSize:
                          selectedPage.finalCta?.size === "small"
                            ? "12px"
                            : selectedPage.finalCta?.size === "large"
                            ? "18px"
                            : "16px",
                        background: selectedPage.finalCta?.gradient
                          ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
                          : selectedPage.finalCta?.backgroundColor || "#4CAF50",
                        color: selectedPage.finalCta?.textColor || "#ffffff",
                        textAlign: "center",
                        textDecoration: "none",
                        width: "fit-content",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = selectedPage
                          .finalCta?.gradient
                          ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
                          : selectedPage.finalCta?.hoverColor || "#45a049")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = selectedPage
                          .finalCta?.gradient
                          ? `linear-gradient(${selectedPage.finalCta.gradientDirection}, ${selectedPage.finalCta.gradientStart}, ${selectedPage.finalCta.gradientEnd})`
                          : selectedPage.finalCta?.backgroundColor || "#4CAF50")
                      }
                    >
                      {selectedPage.finalCta?.text || "Click Me"}
                    </a>
                  </div>
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content value="analytics" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <AnalyticsDashboard
                  pageId={selectedPage.publicPageId || "defaultPageId"}
                />
              </div>
            </Tabs.Content>
            <Tabs.Content value="tracking" className="space-y-8">
              <div className="bg-[#1B1B21] rounded-lg shadow-lg p-6">
                <div className="max-w-2xl mx-auto space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#D3D3DF] mb-2">
                      Pixel Tracking Setup
                    </h2>
                    <p className="text-[#9898A3]">
                      Configure your tracking pixels to monitor conversions and
                      user engagement
                    </p>
                  </div>

                  {/* Facebook Pixel Section */}
                  <div className="bg-[#24242C] rounded-lg p-6 space-y-4 border border-[#C33AFF]/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-[#1A1A1F]">
                        <svg
                          className="w-6 h-6 text-[#C33AFF]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#D3D3DF]">
                          Facebook Pixel
                        </h3>
                        <p className="text-sm text-[#9898A3]">
                          Track conversions from Facebook Ads
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={selectedPage.facebookPixelId || ""}
                        onChange={(e) =>
                          setSelectedPage({
                            ...selectedPage,
                            facebookPixelId: e.target.value,
                          })
                        }
                        placeholder="Enter Facebook Pixel ID"
                        className="w-full px-4 py-3 bg-[#1A1A1F] border border-[#C33AFF]/20 rounded-lg text-[#D3D3DF] placeholder-[#6C6C7D] focus:outline-none focus:ring-2 focus:ring-[#C33AFF] focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-[#9898A3]">
                        Found in Facebook Events Manager → Data Sources → Choose
                        your pixel → Settings
                      </p>
                    </div>
                  </div>

                  {/* Google Tag Manager Section */}

                  <div className="text-center mt-8">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-[#C33AFF] to-[#7C3AFF] text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 mx-auto"
                    >
                      <span>Save Tracking Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </main>
      </div>
    </>
  );
};
