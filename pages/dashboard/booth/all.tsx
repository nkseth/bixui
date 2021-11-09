import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../../../components/Button";
import DashboardWrapper from "../../../components/dashboard/DashboardWrapper";
import FormWrapper from "../../../components/dashboard/FormWrapper";

import styles from "../../../styles/dashboard/booth/all/page.module.scss";
import { Booth } from "../../../constants/types";
import api from "../../../constants/api";
import { useStoreState } from "../../../hooks/store";
import { useRouter } from "next/router";
import Spinner from "../../../components/Spinner";
import Swal from "sweetalert2";
import { slugValidator } from "./new";
import logoFooter from "../../../public/logo_footer.png";
import { futureDate } from "../../../constants/helpers";

type allPorps = {};

const All: React.FC<allPorps> = ({}) => {
  const [booths, setBooths] = useState<Booth[]>([]);

  const user = useStoreState((s) => s.user);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const [filterKeyword, setFilterKeyword] = useState("");

  const filteredResult = booths.filter((booth) =>
    booth.config.title.includes(filterKeyword)
  );

  useEffect(() => {
    if (!user) return;

    api
      .get("/me/booths")
      .then((res) => {
        const data = res.data.data;
        setBooths(data);
      })
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleBoothDelete = async (slug: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "question",
        text: "Are you sure you want to delete this Booth ?",
        showConfirmButton: true,
        showDenyButton: true,
      });

      if (!isConfirmed) return;

      await api.post(`/booth/${slug}/delete`);

      Swal.fire({
        icon: "success",
        text: "Booth Deleted",
        showConfirmButton: true,
      });

      setBooths((b) => b.filter((r) => r.slug !== slug));
    } catch {
      Swal.fire({
        icon: "error",
        text: "Error while deleting Booth",
        showConfirmButton: true,
      });
    }
  };

  const handleBoothStatusToggle = async (index: number) => {
    try {
      const { isConfirmed } = await Swal.fire({
        icon: "question",
        text: `Are you sure you want to ${
          booths[index].isActive ? "de-" : ""
        }activate this Booth ?`,
        showConfirmButton: true,
        showDenyButton: true,
      });

      if (!isConfirmed) return;

      const { data } = await api.post(
        `/booth/${booths[index].slug}/toggleStatus`
      );

      Swal.fire({
        icon: "success",
        text: `Booth ${booths[index].isActive ? "de-" : ""}activated`,
        showConfirmButton: true,
      });

      setBooths(data.data);
    } catch {
      Swal.fire({
        icon: "error",
        text: "Error while changing Booth status",
        showConfirmButton: true,
      });
    }
  };

  const handleBoothClone = async (oldSlug: string) => {
    const { value: newSlug } = await Swal.fire({
      title: "Enter new booth slug",
      input: "text",
      inputLabel: "Slug",
      showCancelButton: true,
      inputAttributes: { style: "margin: 16px; width: calc(100% - 32px)" },
      inputValidator: async (value) => {
        try {
          await slugValidator.validate(value);
          return null;
        } catch (error) {
          return error as string;
        }
      },
    });

    if (!newSlug) return;

    try {
      const { data } = await api.post(`/booth/${oldSlug}/clone`, {
        newSlug,
      });

      setBooths((b) => [...b, data]);

      Swal.fire({
        titleText: "Booth cloned Succefully",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        titleText: "Error while duplication booth",
        icon: "error",
      });
    }
  };

  return (
    <>
      <DashboardWrapper
        headerProps={{
          location: [
            { title: "Dashboard" },
            { title: "Booth" },
            { title: "All" },
          ],
        }}
        contentHeaderProps={{
          title: "Events",
          actionButton: {
            title: "New Event",
            icon: "fas fa-plus",
            onClick: () => router.push("/dashboard/booth/new"),
          },
        }}
      >
        {isLoading ? (
          <div
            style={{ margin: "0 auto", marginTop: 64, width: "fit-content" }}
          >
            <Spinner />
          </div>
        ) : (
          <>
            <FormWrapper title="Activity" divider>
              <div className={styles.activitiesContainer}>
                <div className={styles.activityContainer}>
                  <i className="fas fa-calendar" />
                  <div>
                    <h4>{booths.length}</h4>
                    <h5>Events Created</h5>
                  </div>
                </div>
                <div className={styles.activityContainer}>
                  <i className="fas fa-camera" />
                  <div>
                    <h4>
                      {booths
                        .map((booth) => booth.imagesCount)
                        .reduce((prev, current) => prev + current, 0)}
                    </h4>
                    <h5>Photos Captured</h5>
                  </div>
                </div>
                <div className={styles.activityContainer}>
                  <i className="fas fa-share-alt" />
                  <div>
                    <h4>-</h4>
                    <h5>Shares Collected</h5>
                  </div>
                </div>
              </div>
            </FormWrapper>
            <div style={{ height: 24 }} />
            <FormWrapper
              title={
                <input
                  type="text"
                  placeholder="Search..."
                  style={{ maxWidth: 360 }}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  value={filterKeyword}
                />
              }
              divider
            >
              <div className={styles.tableContainer} style={{ marginTop: -10 }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid #8c8c8c",
                        lineHeight: "36px",
                      }}
                    >
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Event Start Date</th>
                      <th>Photos</th>
                      <th />
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ height: 12 }} />
                    {filteredResult.map((booth, index) => {
                      const isEventEnded =
                        new Date(booth.ends_at) < futureDate(new Date(), -30);

                      return (
                        <tr key={booth.slug}>
                          <td>
                            {isEventEnded ? (
                              <a href="#" className={styles.disabled}>
                                Event expired
                              </a>
                            ) : (
                              <a
                                href={"/booth/" + booth.slug}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.td}
                              >
                                {booth.config.title}
                              </a>
                            )}
                          </td>
                          {isEventEnded ? (
                            <td className={styles.disabled}>{booth.slug}</td>
                          ) : (
                            <td>{booth.slug}</td>
                          )}
                          {isEventEnded ? (
                            <td className={styles.disabled}>
                              {new Date(booth.starts_at).toLocaleString()}
                            </td>
                          ) : (
                            <td>
                              {new Date(booth.starts_at).toLocaleString()}
                            </td>
                          )}
                          {isEventEnded ? (
                            <td className={styles.disabled}>
                              {booth.imagesCount}
                            </td>
                          ) : (
                            <td>{booth.imagesCount}</td>
                          )}

                          <td className={styles.fitContent}>
                            <Button
                              title={
                                booths[index].isActive
                                  ? "De-activate"
                                  : "Activate"
                              }
                              icon={`fas fa-chevron-${
                                booths[index].isActive ? "down" : "up"
                              }`}
                              onClick={() => handleBoothStatusToggle(index)}
                              disabled={isEventEnded}
                            />
                          </td>
                          <td className={styles.fitContent}>
                            <div className={styles.actionsContainer}>
                              <button
                                title="Edit"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/booth/${booth.slug}/edit`
                                  )
                                }
                                disabled={isEventEnded}
                              >
                                <i className="fas fa-pencil" />
                              </button>
                              <button
                                title="Clone"
                                onClick={() => handleBoothClone(booth.slug)}
                                disabled={isEventEnded}
                              >
                                <i className="fas fa-copy" />
                              </button>
                              <button
                                title="Delete"
                                onClick={() => handleBoothDelete(booth.slug)}
                                disabled={isEventEnded}
                              >
                                <i className="fas fa-trash-alt" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </FormWrapper>
          </>
        )}
      </DashboardWrapper>
      <div className={styles.footer}>
        <div className={styles.logo_footer}>
          <Image src={logoFooter} alt="Powered by BizConnect" />
        </div>
      </div>
    </>
  );
};

export default All;
