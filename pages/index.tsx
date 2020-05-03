import Link from "next/link";
import * as React from "react";

const indexPage = () => {
  return (
      <div>
        <Link href={'/auth/login'}>
          <a>
              <img alt="login button" src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="180" height="35"/>
          </a>
        </Link>
        <Link href={'/faq'}>
          <a>FAQ</a>
        </Link>
      </div>
  );
};

export default indexPage;