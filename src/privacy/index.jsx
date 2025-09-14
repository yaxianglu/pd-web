import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="privacy-content">
          <div className="privacy-section">
            <p>
              本《隱私權政策》（以下稱「本政策」）適用於 www.pearl-digital.com 與 Pearl Digital Inc.（以下稱「本公司」），並規範資料蒐集與使用。除非另有註明，凡本政策所提及「本公司」者，均包含 www.pearl-digital.com。本公司網站為資訊與電子商務網站。使用本公司網站，即表示您同意本政策中所述之資料處理方式。
            </p>
          </div>

          <div className="privacy-section">
            <h2>個人資料之蒐集（Collection of your Personal Information）</h2>
            <p>
              為了更妥善地向您提供所選擇的產品與服務，本公司可能蒐集可識別您個人身份的資訊，例如：
            </p>
            <ul>
              <li>姓名（First and last name）</li>
              <li>郵寄地址（Mailing address）</li>
              <li>電子郵件地址（Email address）</li>
              <li>電話號碼（Phone number）</li>
            </ul>
            <p>
              若您購買本公司之產品或服務，我們將蒐集帳單與信用卡資訊，此資訊將用於完成購買交易。
            </p>
            <p>
              本公司亦可能蒐集非專屬於您的匿名人口統計資訊，例如：
            </p>
            <ul>
              <li>年齡（Age）</li>
              <li>性別（Gender）</li>
            </ul>
            <p>
              除非您自願提供，否則我們不會蒐集任何有關您的個人資料。然而，當您選擇使用特定產品或服務時，可能需要提供個人資料，例如：(a) 註冊帳號；(b) 參加由本公司或合作夥伴舉辦之抽獎或比賽；(c) 訂閱特定第三方的特別優惠；(d) 向我們發送電子郵件；(e) 在訂購與購買產品及服務時提交信用卡或其他付款資訊。
            </p>
            <p>
              上述情形下，我們將使用您的資訊來與您溝通，以提供您所要求之產品與服務。我們亦可能在未來蒐集額外的個人或非個人資訊。
            </p>
          </div>

          <div className="privacy-section">
            <h2>個人資料之使用（Use of your Personal Information）</h2>
            <p>
              本公司蒐集與使用您的個人資料之目的包括：
            </p>
            <ul>
              <li>營運與提供您所要求之服務</li>
              <li>提供您所請求之資訊、產品或服務</li>
              <li>發送有關您帳戶之通知</li>
              <li>履行本公司之義務並行使與您之間任何契約所生之權利，包括帳單與收款</li>
              <li>通知您本公司網站或本公司所提供之任何產品或服務之變更</li>
              <li>依您提供資訊時所述之其他方式使用</li>
              <li>經您同意之其他用途</li>
            </ul>
            <p>
              本公司亦可能使用您的個人資料通知您本公司及其關係企業之其他產品或服務。
            </p>
          </div>

          <div className="privacy-section">
            <h2>與第三方分享資訊（Sharing Information with Third Parties）</h2>
            <p>
              本公司不會將客戶名單出售、出租或出借予第三方。
            </p>
            <p>
              本公司可能代表外部商業夥伴與您聯繫，介紹可能有興趣的產品或服務。在此情況下，您的個人識別資訊（電子郵件、姓名、地址、電話號碼）將提供給該第三方。本公司亦可能與受信任之合作夥伴分享資料，以協助統計分析、寄送電子或實體郵件、提供客服或安排配送。該等第三方不得將您的個人資料用於提供服務以外之任何目的，且必須保密。
            </p>
            <p>
              如法律要求，或基於善意認為有必要時，本公司得在未事先通知的情況下披露您的個人資料，包括：(a) 符合法律或法律程序之要求；(b) 保護與捍衛本公司之權利或財產；(c) 在緊急情況下保護本公司使用者或公眾之人身安全。
            </p>
          </div>

          <div className="privacy-section">
            <h2>拒絕向第三方披露個人資料之權利（Opt-Out of Disclosure of Personal Information to Third Parties）</h2>
            <p>
              如我們為商業目的向第三方披露您的個人資料，您有權知悉：
            </p>
            <ul>
              <li>我們為商業目的所披露之個人資料類別</li>
            </ul>
            <p>
              依《加州消費者隱私法案》（CCPA）及其他適用之隱私及資料保護法律，您有權拒絕向第三方披露您的個人資料。若您行使此權利，我們將停止披露，除非您日後明確授權披露。欲行使該拒絕權，請造訪以下網頁：_______________。
            </p>
          </div>

          <div className="privacy-section">
            <h2>使用者行為追蹤（Tracking User Behavior）</h2>
            <p>
              本公司可能追蹤使用者於本公司網站內所造訪之網頁，以判斷最受歡迎之服務，並據此向對特定主題有興趣之客戶提供客製化內容與廣告。
            </p>
          </div>

          <div className="privacy-section">
            <h2>自動蒐集資訊（Automatically Collected Information）</h2>
            <p>
              本公司可能自動蒐集您的電腦硬體與軟體資訊，包括 IP 位址、瀏覽器類型、網域名稱、存取時間及來源網站地址。此資訊將用於服務運作、維持服務品質及提供網站使用之統計資料。
            </p>
          </div>

          <div className="privacy-section">
            <h2>Cookie 之使用（Use of Cookies）</h2>
            <p>
              本公司網站得使用「Cookie」以協助您個人化您的線上體驗。Cookie 係由網頁伺服器置於您硬碟之文字檔。Cookie 不得用於執行程式或將病毒傳送至您的電腦。Cookie 對您具有唯一性，且僅能由發出該 Cookie 之網域內之網頁伺服器讀取。
            </p>
            <p>
              Cookie 之主要目的之一，係提供便利功能以節省您之時間。Cookie 之目的在於通知網頁伺服器您已返回特定頁面。例如，倘若您於本公司之網頁進行個人化設定，或於本公司網站或服務進行註冊，Cookie 將協助本公司於後續造訪時記憶您的特定資訊，從而簡化記錄您個人資訊（例如帳單地址、運送地址等）之程序。當您再次返回相同之網站時，您先前所提供之資訊得被擷取，以便您得以輕易使用您已於本公司網站所自訂之功能。
            </p>
            <p>
              您得選擇接受或拒絕 Cookie。大多數網際網路瀏覽器會自動接受 Cookie，惟您通常可依個人偏好修改瀏覽器設定以拒絕 Cookie。倘若您選擇拒絕 Cookie，您可能無法完整體驗本公司服務或您所造訪之網站所提供之互動功能。
            </p>
          </div>

          <div className="privacy-section">
            <h2>連結（Links）</h2>
            <p>
              本網站可能包含其他網站之連結。本公司對該等網站之內容或隱私實務不負責。建議您於離開我們的網站時閱讀其他網站的隱私聲明。
            </p>
          </div>

          <div className="privacy-section">
            <h2>個人資料之安全（Security of your Personal Information）</h2>
            <p>
              本公司採用包括 SSL 協定在內之安全措施保護您的個人資料免於未經授權之存取、使用或揭露。當個人資料（如信用卡號碼）傳送至其他網站時，將透過加密保護。
            </p>
            <p>
              然而，網際網路或無線網路之資料傳輸並非百分之百安全，因此您承認並同意：(a) 網際網路固有之安全與隱私限制超出我們控制範圍；(b) 您與我們之間透過本網站交換之所有資訊與資料之安全性、完整性與隱私性，無法獲得完全保證。
            </p>
          </div>

          <div className="privacy-section">
            <h2>刪除權（Right to Deletion）</h2>
            <p>
              在符合下列特定例外情形之前提下，於接獲您所提出之可驗證請求後，我們將：
            </p>
            <ul>
              <li>自我們之紀錄中刪除您的個人資料；及</li>
              <li>指示任何服務供應商自其紀錄中刪除您的個人資料。</li>
            </ul>
            <p>
              惟請注意，如有下列情形之一，我們可能無法遵循您刪除個人資料之請求：
            </p>
            <ul>
              <li>完成蒐集該個人資料之交易，履行依據聯邦法律進行之書面保固條款或產品召回，並提供您所要求或在我們持續之業務關係情境下合理預期之商品或服務，或履行您與我們之間之契約；</li>
              <li>偵測安全事件、防範惡意、欺騙、詐欺或非法行為，或對該等行為之責任人提起訴追；</li>
              <li>除錯以識別及修復影響既有預期功能之錯誤；</li>
              <li>行使言論自由權、確保其他消費者行使其言論自由權，或行使法律所賦予之其他權利；</li>
              <li>遵守《加州電子通訊隱私法》（California Electronic Communications Privacy Act）；</li>
              <li>於符合其他適用倫理與隱私法規之前提下，為公共利益所進行之公共或同儕審查之科學、歷史或統計研究，且刪除該資訊可能使該研究之達成變為不可能或嚴重受阻，並且我們已取得您的知情同意；</li>
              <li>僅為內部使用且該使用與您基於與我們之關係所合理預期之目的相符；</li>
              <li>遵守現行法律義務；或</li>
              <li>以與您提供資訊之情境相容之合法方式，在內部使用您的個人資料。</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>三歲以下兒童（Children Under Thirteen）</h2>
            <p>
              本公司不會明知蒐集十三（13）歲以下兒童之個人資料。若您未滿十三（13）歲，必須取得父母或監護人同意方可使用本網站。
            </p>
          </div>

          <div className="privacy-section">
            <h2>拒收第三方通訊（Opt Out and Unsubscribe from Third-Party Communications）</h2>
            <p>
              我們尊重您的隱私，並提供您選擇拒收第三方夥伴通訊之機會。您可透過以下方式拒收：
            </p>
            <ul>
              <li>網頁：_______________</li>
              <li>電子郵件：customer@pearl-digital.com</li>
              <li>電話：_______________</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>電子郵件通訊（Email Communications）</h2>
            <p>
              本公司可能透過電子郵件與您聯繫，包括公告、促銷優惠、警示、確認、調查等，並可能收到您開啟或點擊郵件內連結之通知。若您不欲再接收行銷或促銷郵件，可回覆「STOP」或點擊取消訂閱按鈕。
            </p>
          </div>

          <div className="privacy-section">
            <h2>外部資料儲存（External Data Storage Sites）</h2>
            <p>
              我們可能將您的資料儲存在與本公司簽約之第三方主機服務供應商之伺服器中。
            </p>
          </div>

          <div className="privacy-section">
            <h2>政策變更（Changes to This Statement）</h2>
            <p>
              本公司保留隨時修改本政策之權利，例如服務內容、資料保護實務或法律之變更。若變更重大，我們將通知您。您繼續使用本網站及／或其提供之服務，即表示您承認並同意遵守經修改之政策。
            </p>
          </div>

          <div className="privacy-section">
            <h2>聯絡資訊（Contact Information）</h2>
            <p>
              如您認為本公司未遵守本政策，請聯絡：
            </p>
            <p>
              Pearl Digital Inc.<br />
              2975 Scott Blvd Ste 110<br />
              Santa Clara, California 95054<br />
              電子郵件：customer@pearl-digital.com<br />
              電話：+1-408-667-5811
            </p>
          </div>

          <div className="privacy-footer">
            <p>生效日（Effective as of）：June 01, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
