<?php
/**
 * Podstawowa konfiguracja WordPressa.
 *
 * Skrypt wp-config.php używa tego pliku podczas instalacji.
 * Nie musisz dokonywać konfiguracji przy pomocy przeglądarki internetowej,
 * możesz też skopiować ten plik, nazwać kopię "wp-config.php"
 * i wpisać wartości ręcznie.
 *
 * Ten plik zawiera konfigurację:
 *
 * * ustawień MySQL-a,
 * * tajnych kluczy,
 * * prefiksu nazw tabel w bazie danych,
 * * ABSPATH.
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Ustawienia MySQL-a - możesz uzyskać je od administratora Twojego serwera ** //
/** Nazwa bazy danych, której używać ma WordPress */
define('DB_NAME', 'resumeapi');

/** Nazwa użytkownika bazy danych MySQL */
define('DB_USER', 'root');

/** Hasło użytkownika bazy danych MySQL */
define('DB_PASSWORD', 'admin');

/** Nazwa hosta serwera MySQL */
define('DB_HOST', 'localhost');

/** Kodowanie bazy danych używane do stworzenia tabel w bazie danych. */
define('DB_CHARSET', 'utf8mb4');

/** Typ porównań w bazie danych. Nie zmieniaj tego ustawienia, jeśli masz jakieś wątpliwości. */
define('DB_COLLATE', '');

/**#@+
 * Unikatowe klucze uwierzytelniania i sole.
 *
 * Zmień każdy klucz tak, aby był inną, unikatową frazą!
 * Możesz wygenerować klucze przy pomocy {@link https://api.wordpress.org/secret-key/1.1/salt/ serwisu generującego tajne klucze witryny WordPress.org}
 * Klucze te mogą zostać zmienione w dowolnej chwili, aby uczynić nieważnymi wszelkie istniejące ciasteczka. Uczynienie tego zmusi wszystkich użytkowników do ponownego zalogowania się.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'x#i6>-&!caDZ[kmT+N?Zc$np7sKU-AAzzVoO&lvN[dMdE]d|CvC]}&5H4lQZ=>@1');
define('SECURE_AUTH_KEY',  '29k7#; M>#zeAR&N=xSpA,A`}uf_J<v+z{rLeNFLYPjPt*M`3`dwXJY4ZXC|*sgF');
define('LOGGED_IN_KEY',    '@NB,A}XbC+@O;apWK6x~i*^<CQ2I3r@jjF%8r0b]OXzhk|+PnpZ2,+5>4N|6?NQM');
define('NONCE_KEY',        'xywko&rVO&V+),@fVz>-R7~-A?Gtt.$SJLct?eJ|r9crvh1s-q}<b)%5c<T9QHEY');
define('AUTH_SALT',        'vaTwpp-];&1+4ciR9dZ%yz4[KoObS-/FInvDEm:dPyH%K<GJufC~^k/|#Mgw~:N`');
define('SECURE_AUTH_SALT', 'BzT8?hu.|pUs[qh_xW6HF{U+qFH@0F&L{aXb-b=%%Y^5Jq.OL`IBd&*<|L-QS>t0');
define('LOGGED_IN_SALT',   'I^mex`vv}AUUQ>Lb05CVP:!Yk!5l]{4$>XsL0~g<rh@Q.)5 Yc!`jt3FP[+!pg=Y');
define('NONCE_SALT',       '2cQ}+G|W}3p,jHXzb!#m}S?;ie~7D o3|H3EYx}fu`Ej P#=SN&|@k$k@Z$i 3Tn');

/**#@-*/

/**
 * Prefiks tabel WordPressa w bazie danych.
 *
 * Możesz posiadać kilka instalacji WordPressa w jednej bazie danych,
 * jeżeli nadasz każdej z nich unikalny prefiks.
 * Tylko cyfry, litery i znaki podkreślenia, proszę!
 */
$table_prefix  = 'resumeapi_';

/**
 * Dla programistów: tryb debugowania WordPressa.
 *
 * Zmień wartość tej stałej na true, aby włączyć wyświetlanie
 * ostrzeżeń podczas modyfikowania kodu WordPressa.
 * Wielce zalecane jest, aby twórcy wtyczek oraz motywów używali
 * WP_DEBUG podczas pracy nad nimi.
 *
 * Aby uzyskać informacje o innych stałych, które mogą zostać użyte
 * do debugowania, przejdź na stronę Kodeksu WordPressa.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* To wszystko, zakończ edycję w tym miejscu! Miłego blogowania! */

/** Absolutna ścieżka do katalogu WordPressa. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Ustawia zmienne WordPressa i dołączane pliki. */
require_once(ABSPATH . 'wp-settings.php');
